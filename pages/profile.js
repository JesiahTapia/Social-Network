import React, { useEffect, useState, useCallback } from 'react';
import { Locale, Avatars, Storage } from 'appwrite';
import { FETCH_STATUS } from '@/utils/constants';
import Select from '@/components/Select';
import MainLayout from '@/components/Layouts/MainLayout';
import useUser from '@/hooks/useUser';
import classNames from 'classnames';
import appwriteClient from '@/libs/appwrite';

export default function Profile() {
  const locale = new Locale(appwriteClient);
  const [profileStatus, setProfileStatus] = useState(FETCH_STATUS.IDLE);
  const { currentAccount } = useUser();
  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    website: '',
    country: '',
    language: '',
  });

  const displayUserSettings = useCallback(async () => {
    setProfileForm({
      name: currentAccount?.name || '',
      bio: currentAccount.prefs?.bio || '',
      website: currentAccount.prefs?.website || '',
      country: currentAccount.prefs?.country || '',
      language: currentAccount.prefs?.language || '',
    });
  }, [currentAccount]);

  useEffect(() => {
    if (currentAccount) {
      displayUserSettings();
    }
  }, [currentAccount, displayUserSettings]);

  const onChangeInput = (event) => {
    const { name, value } = event.target;
    setProfileForm((prevProfileForm) => ({
      ...prevProfileForm,
      [name]: value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setProfileStatus(FETCH_STATUS.LOADING);

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentAccount.$id,
          ...profileForm,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      setProfileStatus(FETCH_STATUS.SUCCESS);
    } catch (error) {
      console.error('Error saving profile:', error);
      setProfileStatus(FETCH_STATUS.FAIL);
    }
  };

  const fetchCountries = async () => {
    const { countries } = await locale.listCountries();
    setCountries(countries.map((country) => ({ value: country, label: country.name })));
  };

  const fetchLanguages = async () => {
    const { languages } = await locale.listLanguages();
    setLanguages(languages.map((language) => ({ value: language, label: language.name })));
  };

  useEffect(() => {
    fetchCountries();
    fetchLanguages();
  }, []);

  return (
    <MainLayout>
      <div className="text-white px-10 py-20 w-1/2 border border-gray-600 h-auto border-t-0">
        <h1 className="text-xl">Edit Profile</h1>
        <form className="flex flex-col mt-6 text-white" onSubmit={onSubmit}>
          <div className="mt-3">
            <label htmlFor="name" className="block pl-4 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="block w-full rounded-full border-gray-800 px-4 py-3 bg-gray-800 shadow-sm focus:ring-1 focus:ring-gray-600 outline-none sm:text-sm mt-1"
              placeholder="Jane Smith"
              value={profileForm.name}
              onChange={onChangeInput}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="bio" className="block pl-4 text-sm font-medium">Bio</label>
            <textarea
              rows="4"
              name="bio"
              id="bio"
              className="block w-full rounded-full border-gray-800 px-4 py-3 bg-gray-800 shadow-sm focus:ring-1 focus:ring-gray-600 outline-none sm:text-sm mt-1"
              placeholder="Tell us something about yourself!"
              value={profileForm.bio}
              onChange={onChangeInput}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="website" className="block pl-4 text-sm font-medium">Website</label>
            <input
              type="text"
              name="website"
              id="website"
              className="block w-full rounded-full border-gray-800 px-4 py-3 bg-gray-800 shadow-sm focus:ring-1 focus:ring-gray-600 outline-none sm:text-sm mt-1"
              placeholder="e.g. https://www.johndoe.dev"
              value={profileForm.website}
              onChange={onChangeInput}
            />
          </div>
          <div className="mt-4">
            <Select
              value={profileForm.country}
              onChange={(event) => {
                setProfileForm((prevProfileForm) => ({
                  ...prevProfileForm,
                  country: event.target.value,
                }));
              }}
              options={countries}
              label="Countries"
            />
          </div>
          <div className="mt-4">
            <Select
              value={profileForm.language}
              onChange={(event) => {
                setProfileForm((prevProfileForm) => ({
                  ...prevProfileForm,
                  language: event.target.value,
                }));
              }}
              options={languages}
              label="Language"
            />
          </div>
          {profileStatus === FETCH_STATUS.SUCCESS && (
            <div className="border-solid py-3 px-5 rounded-md border mt-4 border-green-500 bg-green-100 text-green-500">
              <p>Your settings have been saved successfully!</p>
            </div>
          )}
          <button className="py-2 px-4 rounded-full border-2 text-lg w-40 border-blue-400 text-blue-400 mt-10">Save</button>
        </form>
      </div>
    </MainLayout>
  );
}
