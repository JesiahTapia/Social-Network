import React, { useState } from 'react';
import { Databases, Functions } from 'appwrite';
import appwriteClient from '@/libs/appwrite';
import Modal from '@/components/Modal';

export default function Tweets({ tweet, onTweetRemoved, onLikeTweetCallback }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onRemoveTweet = async () => {
    const databases = new Databases(appwriteClient);

    try {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_DATABASE,
        process.env.NEXT_PUBLIC_TWEETS_COLLECTION,
        tweet.$id
      );
      onTweetRemoved(tweet);
    } catch (error) {
      setIsModalOpen(true);
      console.error('Error deleting tweet:', error);
    }
  };

  const onLikeTweet = async () => {
    try {
      const functions = new Functions(appwriteClient);
      await functions.createExecution(
        '666cbb5300285e2d83ba', 
        JSON.stringify({
          tweetId: tweet.$id,
          likes: (tweet.likes || 0) + 1,
        }),
        true
      );
      onLikeTweetCallback({ ...tweet, likes: (tweet.likes || 0) + 1 });
    } catch (error) {
      console.error('Error liking tweet:', error);
    }
  };

  return (
    <div className="p-8">
      <p className="font-medium leading-6 text-base text-white">
        {tweet.username}{' '}
        <span className="text-gray-500">@{tweet.useremail}</span>
      </p>
      <p className="flex-shrink font-medium text-base text-white">
        {tweet.text}
      </p>

      <div className="flex items-center mt-4">
        <div className="flex-1 text-center">
          <button
            onClick={onLikeTweet}
            className="flex items-center justify-center w-10 h-10 text-gray-500 group rounded-full hover:bg-blue-800 hover:text-blue-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8c1.718 0 3.312.594 4.575 1.67l1.425-1.425a.75.75 0 011.06 1.06L17.06 5.06A8.966 8.966 0 0121 12z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 text-center">
          <button
            onClick={() => console.log('Retweet clicked')} // Placeholder function for retweeting
            className="flex items-center justify-center w-10 h-10 text-gray-500 group rounded-full hover:bg-blue-800 hover:text-blue-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15 18a5 5 0 01-7-7l-4 4 4-4a5 5 0 017 7 5 5 0 010 0z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 text-center">
          <button
            onClick={() => console.log('Comment clicked')} // Placeholder function for commenting
            className="flex items-center justify-center w-10 h-10 text-gray-500 group rounded-full hover:bg-blue-800 hover:text-blue-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex-1 text-center">
          <button
            onClick={onRemoveTweet}
            className="flex items-center justify-center w-10 h-10 text-gray-500 group rounded-full hover:bg-blue-800 hover:text-blue-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Unauthorized access"
        message="It seems that you are trying to remove a tweet, however you are not authorized to do so"
      />
    </div>
  );
}
