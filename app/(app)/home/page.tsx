"use client";
import VideoCard from "@/components/VideoCard";
import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Video } from "@/types";
import UserContext from "@/context/UserContext";

const Home = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const {user} = useUser();
  // console.log(user)
  const {user, setUser} = useContext(UserContext)

  const fetchVideos = useCallback(async () => {
    try {
      const res = await axios.get("/api/videos");

      if (Array.isArray(res.data.data)) {
        setVideos(res.data.data);
      } else {
        throw new Error("unexpected response format");
      }
    } catch (error: any) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Videos</h1>
      {videos.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          No videos available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
