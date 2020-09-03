import React, { FC, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useItemActions } from "../../features/item/itemFeatureSlice";
import { useItemHelpers } from "../../features/item/itemHelpers";
import { AppBar, Box, Tab, Tabs } from "@material-ui/core";
import styled from "styled-components";
import ListItemPage from "../../pages/item/ListPage";
import ListSetPage from "../../pages/set/ListPage";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface IProps {}

export const SwitchTargetList: FC<IProps> = () => {
  const { getTabState } = useItemHelpers;
  const tabState = useSelector(getTabState);
  const { switchTabState } = useItemActions();
  const dispatch = useDispatch();

  const handleChange = (event: ChangeEvent<{}>, newValue: number) =>
    dispatch(switchTabState({ tab: newValue }));

  return (
    <StyledHeader>
      <StyledAppBar position="static">
        <Tabs
          value={tabState}
          onChange={handleChange}
          aria-label="Switch Target Pages With Tabs"
        >
          <Tab label="Item" {...a11yProps(0)} />
          <Tab label="Set" {...a11yProps(1)} />
        </Tabs>
      </StyledAppBar>
      <TabPanel value={tabState} index={0}>
        <ListItemPage />
      </TabPanel>
      <TabPanel value={tabState} index={1}>
        <ListSetPage />
      </TabPanel>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  background-color: #fff;
  flex-grow: 1;
`;

const StyledAppBar = styled(AppBar)`
  color: #000;
  background-color: #eee;
  margin-bottom: 15px;
`;

export { SwitchTargetList as default };
