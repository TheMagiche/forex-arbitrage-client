import React, {useEffect, useState} from 'react'
import {
  Alert,
  Autocomplete,
  Backdrop,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Paper,
  Snackbar,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import {Currency, Rates} from '@Types/currency'
import {CurrencyApi, ArbitrageApi} from 'components/utils/api'
import {v4 as uuidV4} from 'uuid'
import {Arbitrage} from '@Types/arbitrage'

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

const Home = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    null as any
  )
  const [open, setOpen] = useState<boolean>(false)
  const [apiKey, setApiKey] = useState<string>('')
  const [exchangeRates, setExchangeRates] = useState<Rates[]>(null as any)
  const [date, setDate] = useState<string>('')
  const [arbitrage, setArbitrage] = useState<Arbitrage[]>(null as any)
  const [openSnack, setOpenSnack] = useState<boolean>(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCurrencies()
  }, [])

  const fetchCurrencies = () => {
    let currencyService = new CurrencyApi()
    currencyService.getCurrencies().then((response: any) => {
      if (response.data) {
        setCurrencies((response.data as unknown as Currency[]) || [])
      } else {
        setError(response.error)
        setOpenSnack(true)
      }
    })
  }
  const handleClose = () => {
    setOpenSnack(false)
  }
  const handleSubmit = () => {
    if (apiKey === '' || selectedCurrency === null) {
      console.log({apiKey}, exchangeRates)
      setError('Add API key and select a currency')
      setOpenSnack(true)
      return
    }
    let arbitrageService = new ArbitrageApi()
    // add loading screen
    setOpen(true)
    arbitrageService
      .getArbitrage({
        apiKey: apiKey,
        baseCurrency: selectedCurrency.code
      })
      .then((response: any) => {
        setExchangeRates(response.data.rates as Rates[])
        setDate(response.data.date as string)
        setArbitrage(response.data.arbitrage as Arbitrage[])
        //remove loading screen
        setOpen(false)
      })
  }

  return (
    <>
      <main>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className="Arbitrage_header">
              <div className="overlay"></div>
              <Typography variant="h2" gutterBottom className="heading">
                Welcome to the forex arbitrage finder
                <Typography variant="body1">
                  To continue please enter your{' '}
                  <a href="https://www.fastforex.io/">API key</a> and select a
                  currency
                </Typography>
              </Typography>
            </div>
            <div className="Api_box">
              <Grid container spacing={2} alignItems="middle">
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    id="api-key"
                    label="Your api key"
                    variant="outlined"
                    onChange={e => {
                      setApiKey(e.target.value)
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Autocomplete
                    disablePortal
                    id="currency"
                    options={currencies}
                    getOptionLabel={(option: Currency) =>
                      `${option?.code} - ${option?.name}`
                    }
                    isOptionEqualToValue={(option: Currency, value: Currency) =>
                      option.code === value.code
                    }
                    onChange={(event, value: Currency | null) => {
                      setSelectedCurrency(value as unknown as Currency)
                    }}
                    fullWidth
                    renderInput={params => (
                      <TextField {...params} label="Currencies" />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    className="Search_btn"
                    onClick={() => {
                      handleSubmit()
                    }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Grid>
          {exchangeRates && (
            <>
              <Grid item xs={12}>
                <div className="Exchange_heading">
                  <Typography variant="h4" sx={{textAlign: 'center'}}>
                    Currency: {selectedCurrency?.code} -{' '}
                    {selectedCurrency?.name} on{' '}
                    {new Date(date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit'
                    })}
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={3}>
                <div className="Exchange_box">
                  <TableContainer
                    component={Paper}
                    sx={{maxHeight: '500px', overflow: 'scroll'}}
                  >
                    <Table stickyHeader sx={{minWidth: 50}} aria-label="currency table">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{fontWeight: 'bolder'}}>Currency</TableCell>
                          <TableCell sx={{fontWeight: 'bolder'}}>Rate</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {exchangeRates?.map(row => (
                          <StyledTableRow
                            key={uuidV4()}
                            sx={{
                              '&:last-child td, &:last-child th': {border: 0}
                            }}
                          >
                            <StyledTableCell>{row.code}</StyledTableCell>
                            <StyledTableCell>{row.value}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Grid>
              <Grid item xs={9}>
                <div className="Box_arbitrage">
                  {arbitrage.map(arb => (
                    <div className="Arbitrage_instance" key={uuidV4()}>
                      <Card className="cards source">
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="70"
                            image={arb.flag_src}
                            alt={arb.source}
                          />
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              {arb.source}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Sell {arb.rate.toFixed(6)}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                      <Card className="cards dest">
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="70"
                            image={arb.flag_des}
                            alt={arb.destination}
                          />
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              {arb.destination}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Buy {arb.total.toFixed(6)}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </div>
                  ))}
                </div>
              </Grid>
            </>
          )}
        </Grid>
        <Backdrop
          sx={{color: '#fff', zIndex: theme => theme.zIndex.drawer + 1}}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Snackbar open={openSnack} autoHideDuration={6000}>
          <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
            {error}
          </Alert>
        </Snackbar>
      </main>
    </>
  )
}

export default Home
