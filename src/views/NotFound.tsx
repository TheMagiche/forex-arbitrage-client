import React from 'react'
import {useNavigate} from 'react-router-dom'
import {Button, Grid, Typography} from '@mui/material'
import {Icon} from '@iconify/react'
import alertOctagram from '@iconify/icons-mdi/alert-octagram'

const NotFound = () => {
  const history = useNavigate()
  const handleClick = () => history('/')

  return (
    <>
      <main>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={5}>
            <Icon className="Big_icon" icon={alertOctagram} />
          </Grid>
          <Grid item xs={7}>
            <Typography variant="h3">Are you lost? Don't worry</Typography>
            <Button
              className="Big_btn"
              variant="contained"
              onClick={() => {
                handleClick()
              }}
            >
              Go back 😻
            </Button>
          </Grid>
        </Grid>
      </main>
    </>
  )
}

export default NotFound
