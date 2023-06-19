import {Box, TextField, Typography, Grid, List, ListItem, IconButton, ButtonGroup, Tooltip, Stack} from "@mui/material";
import {useContext, useEffect, useRef, useState} from "react";
import {PagesContext} from "../../contexts/PagesContext";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import * as Tabs from "../../utils/tabs";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import '../../App.scss';
import {CoreContext} from "../../contexts/CoreContext";

export const PagesSettings = () => {
  const {pagesContext, setPagesContext} = useContext(PagesContext);
  const {coreContext, setCoreContext} = useContext(CoreContext);

  const [envs, setEnvs] = useState(pagesContext.environments);
  const [pages, setPages] = useState(pagesContext.pages);

  const [currentHostname, setCurrentHostname] = useState('');
  const [currentPage, setCurrentPage] = useState('');

  // const [isCanScrollUp, setIsCanScrollUp] = useState(false);
  // const [isCanScrollDown, setIsCanScrollDown] = useState(false);

  const envListRef = useRef<HTMLInputElement>(null);
  const pageListRef = useRef<HTMLInputElement>(null);

  const [filterIcon, setFilterIcon] = useState(<FilterAltIcon/>);
  const [filterOpen, setFilterOpen] = useState(false);

  const [filter, setFilter] = useState('');

  // const handleScroll = () => {
  //   if (envListRef.current) {
  //     setIsCanScrollUp(envListRef.current.scrollTop > 0);
  //     setIsCanScrollDown(envListRef.current.scrollTop !== envListRef.current.scrollHeight);
  //   }
  // };

  // const getListShadow = () => {
  //   const res: any = {
  //     // overflow: 'hidden',
  //     boxShadow: `${isCanScrollUp ? 'inset 0 -5px 5px -5px rgba(0,0,0,0.5)' : ''}${isCanScrollUp && isCanScrollDown ? ', ' : ''}${isCanScrollDown ? 'inset 0 5px 5px -5px rgba(0,0,0,0.5)' : ''}${!isCanScrollUp && !isCanScrollDown ? 'none' : ''}}`,
  //   };
  //   return res;
  // };

  // useEffect(() => {
    
  //   if (envListRef && envListRef.current) {    
  //     envListRef.current.addEventListener('scroll', handleScroll);
  //     return () => {
  //       if (envListRef && envListRef.current) envListRef.current.removeEventListener('scroll', handleScroll);
  //     };
  //   }
  // }, []);

  useEffect(() => {
    (async () => {
      const currHostname = Tabs.getHostnameFromTab(coreContext.currentTab);
      setCurrentHostname(currHostname);
      setCurrentPage(Tabs.getPathFromTab(coreContext.currentTab));
    })();
  }, [coreContext]);

  useEffect(() => {
    setPagesContext({environments: envs, pages: pages});
  }, [envs, pages]);

  const delEnv = (index: number) => {
    setEnvs((prev) => prev.filter((env, i) => i !== index));
  }

  const delPage = (index: number) => {
    setPages((prev) => prev.filter((page, i) => i !== index));
  }

  function filterOpenHandler() {
    setFilterOpen(!filterOpen);
    setFilterIcon(filterOpen ? <FilterAltIcon/> : <FilterAltIcon color='primary'/>);
  }

  return (
    <>
    <Box
      id='pages-settings-box'
      sx={{ marginTop: '-20px', paddingBottom: '0px'}}
    >
      <Grid
        container
        alignItems="center"
        rowSpacing={0}
      >
        <Grid item xs={12}> {/* Env Buttons */}
          <Box
            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
          >
            <Typography variant="subtitle1">Environments</Typography>
            <ButtonGroup>
              <Tooltip title="Add current">
                <span>
                  <IconButton
                    disabled={!coreContext.isOnBh}
                    onClick={() => {
                      if (envListRef && envListRef.current) envListRef.current.scrollTop = 0;
                      setEnvs((prev) => [{name: '', hostname: currentHostname}, ...prev]);
                    }}
                  >
                    <BookmarkAddIcon/>
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Add">
                <span>
                  <IconButton
                    onClick={() => {
                      if (envListRef && envListRef.current) envListRef.current.scrollTop = 0;
                      setEnvs((prev) => [{name: '', hostname: ''}, ...prev]);
                    }}
                  >
                  <AddIcon/>
                  </IconButton>
                </span>
              </Tooltip>
            </ButtonGroup>
          </Box>
        </Grid>
        <Grid item xs={12}> {/* Env List */}
          <Box
            id='env-list'
            className='pages-list'
            ref={envListRef}
            p={.5}
            mb={'3px'}
            // style={getListShadow()}
          >
            <List
              dense
            >
              {envs.map((env, index) => (
                <ListItem disableGutters key={index} autoFocus={false}>
                  <Grid 
                    container
                    alignItems="center"  
                  >
                    <Grid item xs={3} >
                      <TextField
                        inputProps={{spellCheck: false}}
                        size="small"
                        label="Name"
                        value={envs[index] ? envs[index].name : ''}
                        onChange={(e) => {
                          setEnvs((prev) => prev.map((env, i) => i === index ? {...env, name: e.target.value} : env));
                        }}
                      />
                    </Grid> 
                    <Grid item xs={7.4}>
                      <TextField
                        inputProps={{spellCheck: false}}
                        fullWidth
                        size="small"
                        label="Environment"
                        value={envs[index] ? envs[index].hostname : ''}
                        onChange={(e) => {
                          setEnvs((prev) => prev.map((env, i) => i === index ? {...env, hostname: e.target.value} : env));
                        }}
                      />
                    </Grid>
                    <Grid item pl={.2} xs={1.6}>
                      <IconButton
                        onClick={() => delEnv(index)}
                      >
                        <DeleteIcon/>
                      </IconButton>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
        <Grid item xs={12}> {/* Pages Buttons */}
          <Box
            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
          >
            <Stack direction='row' alignItems='center'>
              <Typography variant="subtitle1">Pages</Typography>
              <Tooltip title='Filter'>
                <span>
                  <IconButton onClick={() => filterOpenHandler()}>
                    {filterIcon}
                  </IconButton>
                </span>
              </Tooltip>
              {filterOpen ? <TextField inputProps={{autocomplete: 'off'}} size='small' label='Filter' value={filter} onChange={(e) => setFilter(e.target.value)}/> : null}
            </Stack>
            <ButtonGroup>
              <Tooltip title="Add current">
                <span>
                  <IconButton
                    disabled={!coreContext.isOnBh || filterOpen}
                    onClick={() => {
                      if (pageListRef && pageListRef.current) pageListRef.current.scrollTop = 0;
                      setPages((prev) => [{name: '', path: currentPage}, ...prev]);
                    }}
                  >
                    <BookmarkAddIcon/>
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Add">
                <span>
                  <IconButton
                    disabled={filterOpen}
                    onClick={() => {
                      if (pageListRef && pageListRef.current) pageListRef.current.scrollTop = 0;
                      setPages((prev) => [{name: '', path: ''}, ...prev]);
                    }}
                  >
                    <AddIcon/>
                  </IconButton>
                </span>
              </Tooltip>
            </ButtonGroup>
          </Box>
        </Grid>
        <Grid item xs={12}> {/* Pages List */}
          <Box
            id='pages-list'
            ref={pageListRef}
            className='pages-list'
            p={.5}
          >
            <List
              dense
            >
              {pages.map((page, index) => { 
                if (filterOpen
                    && (
                      !page.name.toLowerCase().includes(filter.toLowerCase())
                      && !page.path.toLowerCase().includes(filter.toLowerCase())
                    )
                    // || !savedPages.find((p) => p.name === page.name && p.path === page.path)            
                    )
                  return null;
                return (
                <ListItem disableGutters key={index}>
                  <Grid 
                    container 
                    alignItems="center"
                  >
                    <Grid item xs={3}>
                      <TextField
                        inputProps={{spellCheck: false}}
                        size="small"
                        label="Name"
                        value={pages[index] ? pages[index].name : ''}
                        onChange={(e) => {
                          setPages((prev) => prev.map((env, i) => i === index ? {...env, name: e.target.value} : env)); //TODO: use spread operator?
                        }}
                      />
                    </Grid> 
                    <Grid item xs={7.4}>
                      <TextField
                        inputProps={{spellCheck: false}}
                        fullWidth
                        size="small"
                        label="Page"
                        value={pages[index] ? pages[index].path : ''}
                        onChange={(e) => {
                          setPages((prev) => prev.map((page, i) => i === index ? {...page, path: e.target.value} : page)); //TODO: use spread operator?
                        }}
                      />
                    </Grid>
                    <Grid item pl={.2} xs={1.6}>
                      <IconButton
                        onClick={() => delPage(index)}
                      >
                        <DeleteIcon/>
                      </IconButton>
                    </Grid>
                  </Grid>
                </ListItem>
              )
            }
              )}
            </List>
          </Box>
        </Grid>
      </Grid>
    </Box>
    </>
  );
};