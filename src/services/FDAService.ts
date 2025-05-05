import axios from 'axios';

const FDA_BASE_URL = 'https://api.fda.gov/drug/event.json';

// Fallback data for when API is unavailable
const FALLBACK_STATS = {
  totalReports: 0,
  seriousEvents: 0,
  recentReports: 0,
  commonReactions: {
    'nausea': 0,
    'headache': 0,
    'dizziness': 0,
    'fatigue': 0,
    'diarrhea': 0
  }
};

interface FAERSResponse {
  results: Array<{
    patient: {
      reaction: Array<{
        reactionmeddrapt: string;
      }>;
      drug: Array<{
        medicinalproduct: string;
        drugcharacterization: string;
      }>;
    };
    receiptdate: string;
    serious: string;
    seriousnessdeath: string;
    seriousnesshospitalization: string;
    seriousnesslifethreatening: string;
    seriousnessdisabling: string;
  }>;
  meta: {
    results: {
      total: number;
      skip: number;
      limit: number;
    };
  };
}

interface DrugStats {
  totalReports: number;
  seriousEvents: number;
  recentReports: number;
  commonReactions: { [key: string]: number };
  severityBreakdown: {
    death: number;
    hospitalization: number;
    lifeThreatening: number;
    disabling: number;
  };
}

export class FDAService {
  private static API_KEY = process.env.VITE_FDA_API_KEY || '';

  private static buildQuery(params: {
    search?: string;
    sort?: string;
    count?: string;
    limit?: number;
    skip?: number;
  }): string {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.count) queryParams.append('count', params.count);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.skip) queryParams.append('skip', params.skip.toString());
    
    return queryParams.toString();
  }

  static async getDrugStats(drugName: string): Promise<DrugStats> {
    try {
      if (!this.API_KEY) {
        console.warn('No FDA API key found. Using fallback data.');
        return { ...FALLBACK_STATS, severityBreakdown: {
          death: 0,
          hospitalization: 0,
          lifeThreatening: 0,
          disabling: 0
        }};
      }

      // First, get the total count of reports
      const countQuery = this.buildQuery({
        search: `patient.drug.medicinalproduct:"${drugName}"`,
        count: 'patient.reaction.reactionmeddrapt.exact'
      });
      
      const countUrl = `${FDA_BASE_URL}?${countQuery}${this.API_KEY ? `&api_key=${this.API_KEY}` : ''}`;
      const countResponse = await axios.get(countUrl);
      
      // Then get detailed reports with sorting by date
      const reportsQuery = this.buildQuery({
        search: `patient.drug.medicinalproduct:"${drugName}"`,
        sort: 'receiptdate:desc',
        limit: 100
      });
      
      const reportsUrl = `${FDA_BASE_URL}?${reportsQuery}${this.API_KEY ? `&api_key=${this.API_KEY}` : ''}`;
      const reportsResponse = await axios.get<FAERSResponse>(reportsUrl);
      
      if (!reportsResponse.data || !reportsResponse.data.results) {
        console.warn('Invalid FDA API response. Using fallback data.');
        return { ...FALLBACK_STATS, severityBreakdown: {
          death: 0,
          hospitalization: 0,
          lifeThreatening: 0,
          disabling: 0
        }};
      }

      const stats: DrugStats = {
        totalReports: reportsResponse.data.meta.results.total,
        seriousEvents: 0,
        recentReports: 0,
        commonReactions: {},
        severityBreakdown: {
          death: 0,
          hospitalization: 0,
          lifeThreatening: 0,
          disabling: 0
        }
      };

      // Calculate statistics from the results
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

      reportsResponse.data.results.forEach(report => {
        // Count serious events
        if (report.serious === '1') {
          stats.seriousEvents++;
        }

        // Count severity types
        if (report.seriousnessdeath === '1') stats.severityBreakdown.death++;
        if (report.seriousnesshospitalization === '1') stats.severityBreakdown.hospitalization++;
        if (report.seriousnesslifethreatening === '1') stats.severityBreakdown.lifeThreatening++;
        if (report.seriousnessdisabling === '1') stats.severityBreakdown.disabling++;

        // Count recent reports
        const reportDate = new Date(report.receiptdate);
        if (reportDate >= thirtyDaysAgo) {
          stats.recentReports++;
        }

        // Count common reactions
        report.patient.reaction.forEach(reaction => {
          const reactionName = reaction.reactionmeddrapt.toLowerCase();
          stats.commonReactions[reactionName] = (stats.commonReactions[reactionName] || 0) + 1;
        });
      });

      // Get top reactions from count response
      if (countResponse.data && countResponse.data.results) {
        countResponse.data.results.forEach((result: any) => {
          if (result.term && result.count) {
            stats.commonReactions[result.term.toLowerCase()] = result.count;
          }
        });
      }

      return stats;
    } catch (error) {
      console.error('Error fetching FDA FAERS data:', error);
      console.warn('Using fallback data due to API error');
      return { ...FALLBACK_STATS, severityBreakdown: {
        death: 0,
        hospitalization: 0,
        lifeThreatening: 0,
        disabling: 0
      }};
    }
  }

  static async getDrugInteractionStats(drug1: string, drug2: string): Promise<{
    totalInteractions: number,
    commonReactions: { [key: string]: number },
    severityBreakdown: {
      death: number;
      hospitalization: number;
      lifeThreatening: number;
      disabling: number;
    }
  }> {
    try {
      if (!this.API_KEY) {
        console.warn('No FDA API key found. Using fallback data.');
        return {
          totalInteractions: 0,
          commonReactions: FALLBACK_STATS.commonReactions,
          severityBreakdown: {
            death: 0,
            hospitalization: 0,
            lifeThreatening: 0,
            disabling: 0
          }
        };
      }

      // First, get the total count of reports
      const countQuery = this.buildQuery({
        search: `patient.drug.medicinalproduct:"${drug1}"+AND+patient.drug.medicinalproduct:"${drug2}"`,
        count: 'patient.reaction.reactionmeddrapt.exact'
      });
      
      const countUrl = `${FDA_BASE_URL}?${countQuery}${this.API_KEY ? `&api_key=${this.API_KEY}` : ''}`;
      const countResponse = await axios.get(countUrl);

      // Then get detailed reports
      const reportsQuery = this.buildQuery({
        search: `patient.drug.medicinalproduct:"${drug1}"+AND+patient.drug.medicinalproduct:"${drug2}"`,
        sort: 'receiptdate:desc',
        limit: 100
      });
      
      const reportsUrl = `${FDA_BASE_URL}?${reportsQuery}${this.API_KEY ? `&api_key=${this.API_KEY}` : ''}`;
      const reportsResponse = await axios.get<FAERSResponse>(reportsUrl);
      
      if (!reportsResponse.data || !reportsResponse.data.results) {
        console.warn('Invalid FDA API response. Using fallback data.');
        return {
          totalInteractions: 0,
          commonReactions: FALLBACK_STATS.commonReactions,
          severityBreakdown: {
            death: 0,
            hospitalization: 0,
            lifeThreatening: 0,
            disabling: 0
          }
        };
      }

      const stats = {
        totalInteractions: reportsResponse.data.meta.results.total,
        commonReactions: {} as { [key: string]: number },
        severityBreakdown: {
          death: 0,
          hospitalization: 0,
          lifeThreatening: 0,
          disabling: 0
        }
      };

      // Analyze common reactions in drug interactions
      reportsResponse.data.results.forEach(report => {
        // Count severity types
        if (report.seriousnessdeath === '1') stats.severityBreakdown.death++;
        if (report.seriousnesshospitalization === '1') stats.severityBreakdown.hospitalization++;
        if (report.seriousnesslifethreatening === '1') stats.severityBreakdown.lifeThreatening++;
        if (report.seriousnessdisabling === '1') stats.severityBreakdown.disabling++;

        report.patient.reaction.forEach(reaction => {
          const reactionName = reaction.reactionmeddrapt.toLowerCase();
          stats.commonReactions[reactionName] = (stats.commonReactions[reactionName] || 0) + 1;
        });
      });

      // Get top reactions from count response
      if (countResponse.data && countResponse.data.results) {
        countResponse.data.results.forEach((result: any) => {
          if (result.term && result.count) {
            stats.commonReactions[result.term.toLowerCase()] = result.count;
          }
        });
      }

      return stats;
    } catch (error) {
      console.error('Error fetching FDA FAERS interaction data:', error);
      console.warn('Using fallback data due to API error');
      return {
        totalInteractions: 0,
        commonReactions: FALLBACK_STATS.commonReactions,
        severityBreakdown: {
          death: 0,
          hospitalization: 0,
          lifeThreatening: 0,
          disabling: 0
        }
      };
    }
  }

  static async getOverallStats(): Promise<{
    fatalEvents: number;
    totalErrors: number;
    preventableEvents: number;
  }> {
    try {
      if (!this.API_KEY) {
        console.warn('No FDA API key found. Using fallback data.');
        return {
          fatalEvents: 0,
          totalErrors: 0,
          preventableEvents: 0
        };
      }

      // Get total count of reports
      const totalQuery = this.buildQuery({
        search: 'receivedate:[20230101 TO 20231231]'
      });
      
      // Get count of fatal events
      const fatalQuery = this.buildQuery({
        search: 'receivedate:[20230101 TO 20231231] AND seriousnessdeath:1'
      });
      
      // Get count of preventable events
      const preventableQuery = this.buildQuery({
        search: 'receivedate:[20230101 TO 20231231] AND serious:1'
      });
      
      const [totalResponse, fatalResponse, preventableResponse] = await Promise.all([
        axios.get(`${FDA_BASE_URL}?${totalQuery}${this.API_KEY ? `&api_key=${this.API_KEY}` : ''}`),
        axios.get(`${FDA_BASE_URL}?${fatalQuery}${this.API_KEY ? `&api_key=${this.API_KEY}` : ''}`),
        axios.get(`${FDA_BASE_URL}?${preventableQuery}${this.API_KEY ? `&api_key=${this.API_KEY}` : ''}`)
      ]);

      return {
        fatalEvents: fatalResponse.data?.meta?.results?.total || 0,
        totalErrors: totalResponse.data?.meta?.results?.total || 0,
        preventableEvents: preventableResponse.data?.meta?.results?.total || 0
      };
    } catch (error) {
      console.error('Error fetching FDA overall statistics:', error);
      return {
        fatalEvents: 0,
        totalErrors: 0,
        preventableEvents: 0
      };
    }
  }
} 