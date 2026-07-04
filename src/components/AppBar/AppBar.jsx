import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import Typography from '@mui/material/Typography'
// import Workspaces from './Menus/Workspaces'
// import Recent from './Menus/Recent'
// import Starred from './Menus/Starred'
// import Templates from './Menus/Templates'
import Profile from './Menus/Profile'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import { fetchBoardsAPI } from '~/apis/index'

function AppBar() {
  const [searchValue, setSearchValue] = useState('')
  const [boardOptions, setBoardOptions] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    setSearchValue(query.get('search') || '')
  }, [location.search])

  useEffect(() => {
    const trimmedValue = searchValue.trim()

    if (!trimmedValue) {
      setBoardOptions([])
      return undefined
    }

    const timerId = window.setTimeout(() => {
      setIsSearching(true)
      fetchBoardsAPI(`?search=${encodeURIComponent(trimmedValue)}&page=1&itemPerPage=5`)
        .then((res) => {
          setBoardOptions((res.boards || []).map((board) => ({
            _id: board._id,
            title: board.title,
            description: board.description
          })))
        })
        .catch(() => {
          setBoardOptions([])
        })
        .finally(() => {
          setIsSearching(false)
        })
    }, 300)

    return () => window.clearTimeout(timerId)
  }, [searchValue])

  const handleSearchBoards = () => {
    const trimmedValue = searchValue.trim()
    const nextQuery = new URLSearchParams()

    if (trimmedValue) {
      nextQuery.set('search', trimmedValue)
    }

    nextQuery.set('page', '1')

    const queryString = nextQuery.toString()
    navigate(`/boards${queryString ? `?${queryString}` : ''}`)
  }

  const handleClearSearch = () => {
    setSearchValue('')
    setBoardOptions([])
    navigate('/boards?page=1')
  }

  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.customStyles.heightSmall,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode) === 'dark' ? '#2c3e50' : '#1565c0'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link to="/boards" >
          <Tooltip title="Board List">
            <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }}/>
          </Tooltip>
        </Link>
        <Link to="/" >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon component={ TrelloIcon } fontSize='small' inheritViewBox sx={{ color: 'white' }} />
            <Typography variant='span' sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', lineHeight: '27px' }}>Trello</Typography>
          </Box>
        </Link>

        {/* <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
          <Button sx={{ color: 'white' }} startIcon={<LibraryAddIcon />} >Create</Button>
        </Box> */}

      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Autocomplete
          id="board-search"
          freeSolo
          disablePortal
          loading={isSearching}
          options={boardOptions}
          inputValue={searchValue}
          onInputChange={(_, newInputValue) => setSearchValue(newInputValue)}
          onChange={(_, selectedOption) => {
            if (selectedOption && typeof selectedOption !== 'string' && selectedOption._id) {
              setSearchValue(selectedOption.title)
              navigate(`/boards/${selectedOption._id}`)
            }
          }}
          getOptionLabel={(option) => {
            if (typeof option === 'string') return option
            return option.title || ''
          }}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option._id}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{option.title}</Typography>
                {option.description && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {option.description}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search..."
              size="small"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleSearchBoards()
                }
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start" onClick={handleSearchBoards} sx={{ cursor: 'pointer' }}>
                    <SearchIcon sx={{ color: 'white' }} />
                  </InputAdornment>
                )
              }}
              sx={{
                minWidth: '180px',
                maxWidth: '260px',
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
          )}
          sx={{ minWidth: '180px', maxWidth: '260px' }}
        />

        <ModeSelect/>

        {/* Notification */}
        <Notifications />

        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }} />
        </Tooltip>

        <Profile />
      </Box>
    </Box>
  )
}

export default AppBar
