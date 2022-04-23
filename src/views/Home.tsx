import React, {useEffect, useState} from 'react'
import {
  Autocomplete,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Paper,
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
  const [apiKey, setApiKey] = useState<string>('')
  const [exchangeRates, setExchangeRates] = useState<Rates[]>(null as any)
  const [date, setDate] = useState<string>('')
  const [arbitrage, setArbitrage] = useState<Arbitrage[]>(null as any)
  useEffect(() => {
    let currencyService = new CurrencyApi()
    currencyService.getCurrencies().then(data => {
      setCurrencies((data as unknown as Currency[]) || [])
    })
  }, [])

  const handleSubmit = () => {
    let arbitrageService = new ArbitrageApi()
    arbitrageService
      .getArbitrage({
        apiKey: apiKey,
        baseCurrency: selectedCurrency.code
      })
      .then(data => {
        setExchangeRates(data.rates as Rates[])
        setDate(data.date as string)
        setArbitrage(data.arbitrage as Arbitrage[])
      })
  }

  return (
    <>
      <main>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className='Arbitrage_header'>
              <div className='overlay'></div>
              <Typography variant="h2" gutterBottom className='heading'>
                Welcome to the forex arbitrage finder
                <Typography variant="h5">
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
                    getOptionLabel={(option: any) =>
                      `${option?.code} - ${option?.name}`
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
                    <Table sx={{minWidth: 50}} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Currency</TableCell>
                          <TableCell>Rate</TableCell>
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
                    <div className="Arbitrage_instance">
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
      </main>
    </>
  )
}

export default Home
