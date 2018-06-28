import { LiveBroadcasts } from './LiveBroadcasts';

export interface LiveBroadCastlistResponse {
  kind: 'youtube#liveBroadcastListResponse';
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: LiveBroadcasts[];
}
