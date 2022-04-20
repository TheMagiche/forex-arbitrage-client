import React, {useEffect, useState} from 'react'
import {Autocomplete, Button, Grid, TextField, Typography} from '@mui/material'
import {Currency} from '@Types/currency'
import {CurrencyApi} from 'components/utils/api'

const Home = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([])

  useEffect(() => {
    let currencyService = new CurrencyApi()
    currencyService.getCurrencies().then(data => {
      // setCurrencies(data as unknown as Currency[] || [])
    })
  }, [])

  return (
    <>
      <main>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Welcome to the forex arbitrage finder
              <Typography variant="body1">
                To continue please enter your{' '}
                <a href="https:/currencyapi.com/">API key</a> and select a
                currency
              </Typography>
            </Typography>

            <div className="Api_box">
              <Grid container spacing={2} alignItems="middle">
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    id="api-key"
                    label="Your api key"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={4}>
                  <Autocomplete
                    disablePortal
                    id="currency"
                    options={currencies}
                    fullWidth
                    renderInput={params => (
                      <TextField {...params} label="Currencies" />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button variant="contained" className="Search_btn">
                    Search
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </main>
    </>
  )
}

export default Home
