import React, { useState, useEffect } from 'react';
import { TextField, CircularProgress } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import data from './data/FullOrgNameList.json';
import SwipeableEdgeDrawer from './ResultPanel';
import Typography from '@mui/material/Typography';
import { styled, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      '-apple-system',
    ].join(','),
    fontSize: 12,
  },
});

type ItemData = {
  Name: string;
  Services?: string; // Make 'Services' optional
};

interface ImgMediaCardProps {
  setPinLocation: React.Dispatch<React.SetStateAction<[number, number]>>;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SearchBox({ setPinLocation, setIsDrawerOpen }: ImgMediaCardProps) {
  const [open, setOpen] = useState(false);
  const [orgData, setOrgData] = useState<ItemData[]>([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Transform the array of strings into an array of ItemData objects
    const transformedData: ItemData[] = data.map((name) => ({ Name: name }));
    setOrgData(transformedData);
  }, []);

  async function sendOrgName() {
    const response = await fetch('https://bap-backend-4394596572af.herokuapp.com/searchByName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ organization: selectedOrg }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
  }

  async function sendOrgService() {
    const response = await fetch('https://bap-backend-4394596572af.herokuapp.com/searchByService', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ organization: inputValue }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
  }
  async function sendData() {
    if (!selectedOrg.trim() && !inputValue.trim()) {
      await sendOrgService();
    } else {
      if (selectedOrg.trim()) {
        await sendOrgName();
      }
      if (inputValue.trim()) {
        await sendOrgService();
      }
    }
  }
  return (
    <div>
      <Typography variant='h1' fontSize={16} fontWeight={'bold'} gutterBottom marginBottom={'1rem'}>
        Search by Organization Name
      </Typography>
      <Autocomplete
        id="org-name-search"
        open={open && !inputValue}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(event, newValue: string | null) => {
          setSelectedOrg(newValue || '');
          if (newValue) setInputValue('');
        }}
        options={orgData.map((item) => item.Name)}
        disabled={!!inputValue}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search organizations"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {open && orgData.length === 0 ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
            sx={{ height: '3rem', width: '100%', marginBottom: '2rem' }}
          />
        )}
      />
      <Typography variant='h1' fontSize={16} fontWeight={'bold'} gutterBottom marginBottom={'1rem'}>
        Search by Services Provided
      </Typography>
      <Autocomplete
        disablePortal
        id="org-service-search"
        options={topServices}
        onChange={(event, newInputValue: any) => {
          if (newInputValue) {
            setSelectedOrg('');
          }
          setInputValue(newInputValue ? newInputValue.label : '');
        }}
        disabled={!!selectedOrg}
        renderInput={(params) => <TextField {...params} label="Search Service?" sx={{ height: '3rem', width: '100%', marginBottom: '2rem' }} />}
      />
      <SwipeableEdgeDrawer onSearch={sendData} setPinLocation={setPinLocation} setIsDrawerOpen={setIsDrawerOpen} />
    </div>
  );
}
const labels = [
  "Health",
  "Medical",
  "Art therapy",
  "After school programs",
  "Children",
  "Abused women",
  "Vulnerable children",
  "School",
  "Education",
  "Volunteer",
  "Work",
  "Lifeskills",
  "Legal aid",
  "Work",
  "ECD",
  "Mentoring",
  "LGBTQ+",
  "Shelter",
  "Employment",
  "Literacy/numeracy programs",
  "College prep",
  "Music",
];
const topServices = labels.map((label) => ({ label }));  