export interface LiveBroadcasts {
  kind: 'youtube#liveBroadcast';
  etag: string;
  id: string;
  snippet: {
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      [key: string]: {
        url: string;
        width: number;
        height: number;
      };
    };
    scheduledStartTime: Date;
    scheduledEndTime: Date;
    actualStartTime: Date;
    actualEndTime: Date;
    isDefaultBroadcast: boolean;
    liveChatId: string;
  };
  status: {
    lifeCycleStatus: string;
    privacyStatus: string;
    recordingStatus: string;
  };
  contentDetails: {
    boundStreamId: string;
    boundStreamLastUpdateTimeMs: Date;
    monitorStream: {
      enableMonitorStream: boolean;
      broadcastStreamDelayMs: number;
      embedHtml: string;
    };
    enableEmbed: boolean;
    enableDvr: boolean;
    enableContentEncryption: boolean;
    startWithSlate: boolean;
    recordFromStart: boolean;
    enableClosedCaptions: boolean;
    closedCaptionsType: string;
    projection: string;
    enableLowLatency: boolean;
    latencyPreference: boolean;
    enableAutoStart: boolean;
  };
  statistics: {
    totalChatCount: number;
  };
}
