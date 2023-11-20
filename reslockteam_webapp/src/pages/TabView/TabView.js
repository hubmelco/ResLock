import React, {useEffect, useState} from 'react';
import './TabView.css'
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import colors from '../../static/colors'
import { styled } from '@mui/material/styles';
import EditOrg from '../EditOrg';
import EditBuildings from '../EditBuildings';
import ManageAdmins from '../ManageAdmins';
import Header from '../../components/Header';
import UploadResidents from '../UploadResidents/UploadResidents';
import ManageResidents from '../ManageResidents/ManageResidents';
import { useAppSelector } from '../../redux/hooks';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
        {value === index && (
          <Box>
            {children}
          </Box>
        )}
      </div>
    );
}
  
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const AntTabs = styled(Tabs)({
  borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: colors.DARK_ORANGE,
  },
  '& .Mui-selected': {
      color: colors.DARK_ORANGE,
  },
});

const CreateTabs = () => {
  const [value, setValue] = useState(0);
    const privilege = useAppSelector(state => state.user.user.privilege)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
  return (
    privilege === 0 ?
    // Super Admin Tabs
      <div className='Tabs'>
        <AntTabs value={value} onChange={handleChange} centered indicatorColor={colors.DARK_ORANGE} textColor={colors.DARK_ORANGE} variant='fullWidth'>
            <Tab label="Edit Organization"/>
            <Tab label="Edit Buildings" />
            <Tab label="Manage Admins" />
            <Tab label="Manage Residents" />
            <Tab label="Upload Residents" />
        </AntTabs>
        <TabPanel value={value} index={0}>
            <EditOrg/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <EditBuildings/>
        </TabPanel>
        <TabPanel value={value} index={2}>
            <ManageAdmins/>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <ManageResidents/>
        </TabPanel>
        <TabPanel value={value} index={4}>
            <UploadResidents/>
        </TabPanel>
      </div>
    : 
    // Admin Tabs
      <div className='Tabs'>
          <AntTabs value={value} onChange={handleChange} centered indicatorColor={colors.DARK_ORANGE} textColor={colors.DARK_ORANGE} variant='fullWidth'>
              <Tab label="Manage Residents" />
              <Tab label="Upload Residents" />
          </AntTabs>
          <TabPanel value={value} index={0}>
            <ManageResidents/>
          </TabPanel>
          <TabPanel value={value} index={1}>
              <UploadResidents/>
          </TabPanel>
      </div>
  )
}

function TabView() {
    return(
        <div>
          <Header/>
          <div className='containerForModal'>
              <div className='TabView'>
                  <div className='Tabs'>
                      <CreateTabs/>
                  </div>
              </div>
          </div>
        </div>
    )

}

export default TabView;