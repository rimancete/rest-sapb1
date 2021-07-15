export interface CurrencyQuote{
   CurrencyIsoFrom: string,
   CurrencyCategoryCode: string,
   CurrencyIsoTo: string,
   QuoteDate: Date,
   Quote: number,
   Factor?: number
}