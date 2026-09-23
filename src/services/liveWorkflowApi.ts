export interface LiveWorkflowEligibility {
  clientId: string;
  taxYear: number;

  revision: number;
  activeStage: 1 | 2 | 3;

  eligibility: {
    stage1: boolean;
    stage2: boolean;
    stage3: boolean;
  };

  status: {
    stage1: string;
    stage2: string;
    stage3: string;
  };

  externalSubmissionEnabled: false;
}

export interface LiveWorkflowStageState {
  stage: 1 | 2 | 3;

  status:
    | 'LOCKED'
    | 'IN_PROGRESS'
    | 'READY_FOR_REVIEW'
    | 'COMPLETED';

  completedAt?: string;
  completedBy?: string;
}

export interface LiveWorkflowState {
  clientId: string;
  taxYear: number;

  environment: 'live';

  revision: number;

  activeStage: 1 | 2 | 3;

  stage1: LiveWorkflowStageState;
  stage2: LiveWorkflowStageState;
  stage3: LiveWorkflowStageState;

  externalSubmissionEnabled: false;

  createdAt: string;
  updatedAt: string;
}

export class LiveWorkflowApi {

  static async getState(
    taxYear: number
  ): Promise<LiveWorkflowState> {

    const token =
      localStorage.getItem('taxguard_token');

    if (!token) {
      throw new Error(
        'Authenticated TaxGuard session required.'
      );
    }

    const response = await fetch(
      `/api/live-workflow/state?taxYear=${encodeURIComponent(
        String(taxYear)
      )}`,
      {
        method: 'GET',

        headers: {
          Authorization: `Bearer ${token}`,
          'x-session-token': token
        }
      }
    );

    if (!response.ok) {

      const payload = await response
        .json()
        .catch(() => ({}));

      throw new Error(
        payload.error ||
        'Unable to load LIVE workflow state.'
      );
    }

    const payload = await response.json();

    return payload.workflow as LiveWorkflowState;
  }

  static async getEligibility(
    taxYear: number
  ): Promise<LiveWorkflowEligibility> {

    const token =
      localStorage.getItem('taxguard_token');

    if (!token) {
      throw new Error(
        'Authenticated TaxGuard session required.'
      );
    }

    const response = await fetch(
      `/api/live-workflow/eligibility?taxYear=${encodeURIComponent(
        String(taxYear)
      )}`,
      {
        method: 'GET',

        headers: {
          Authorization: `Bearer ${token}`,
          'x-session-token': token
        }
      }
    );

    if (!response.ok) {

      const payload = await response
        .json()
        .catch(() => ({}));

      throw new Error(
        payload.error ||
        'Unable to load workflow eligibility.'
      );
    }

    return response.json();
  }

}
