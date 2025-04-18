
import axios from 'axios';
import { Video } from '@/types';

const API_KEY = 'AIzaSyBYNP_eNKGinulnrNlzcjN0hmex-mJSCcE';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Format YouTube API response into our Video type
const formatVideoResponse = (item: any): Video => {
  return {
    id: item.id.videoId || item.snippet.resourceId?.videoId || item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
    publishedAt: item.snippet.publishedAt,
    duration: item.contentDetails?.duration,
  };
};

// Get videos from a specific playlist
export const getPlaylistVideos = async (playlistId: string): Promise<Video[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/playlistItems`, {
      params: {
        part: 'snippet',
        maxResults: 50,
        playlistId,
        key: API_KEY
      }
    });

    // Get video IDs for duration info
    const videoIds = response.data.items.map((item: any) => 
      item.snippet.resourceId.videoId
    ).join(',');

    // Get video details for duration info
    const detailsResponse = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'contentDetails',
        id: videoIds,
        key: API_KEY
      }
    });

    // Map duration to videos
    const durationMap = detailsResponse.data.items.reduce((acc: any, item: any) => {
      acc[item.id] = item.contentDetails.duration;
      return acc;
    }, {});

    return response.data.items.map((item: any) => {
      const videoId = item.snippet.resourceId.videoId;
      return {
        ...formatVideoResponse(item),
        id: videoId,
        duration: durationMap[videoId]
      };
    });
  } catch (error) {
    console.error('Error fetching playlist videos:', error);
    return [];
  }
};

// Search videos from channel
export const searchVideos = async (query: string, channelId?: string): Promise<Video[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults: 20,
        q: query,
        type: 'video',
        channelId,
        key: API_KEY
      }
    });

    return response.data.items.map(formatVideoResponse);
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
};

// Get information about a specific video
export const getVideoById = async (videoId: string): Promise<Video | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,contentDetails',
        id: videoId,
        key: API_KEY
      }
    });

    if (response.data.items.length === 0) {
      return null;
    }

    return formatVideoResponse(response.data.items[0]);
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};
