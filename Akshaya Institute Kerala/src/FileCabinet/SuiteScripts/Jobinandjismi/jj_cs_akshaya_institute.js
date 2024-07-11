/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/currency', 'N/http'],
/**
 * @param{record} record
 * @param{search} search
 * @param{currency} currency
 * @param{http} http
 */
function(record, search, currency, http) {

    /**
     * Function to be executed when field is changed.
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {
        try{
            let currentRec = scriptContext.currentRecord;
            let fieldId = scriptContext.fieldId;
            if(fieldId === 'custpage_jj_ai_language'){
                let languageId = currentRec.getValue('custpage_jj_ai_language');
                console.log("language ID is : ",languageId);

                //Look the fee record
                let feeRecord = search.lookupFields({
                    type: 'customrecord_jj_fee_details',
                    id: languageId,
                    columns: ['custrecord_jj_language_fee']
                })
                let languageFee = feeRecord.custrecord_jj_language_fee;
                console.log("fee is ", languageFee);
                currentRec.setValue({fieldId: 'custpage_jj_ai_fee_amount', value: languageFee});

                //Linking the suitelet 
                document.location = url.resolveScript({
                    scriptId : 'customscript_jj_sl_akshaya_institute',
                    deploymentId : 'customdeploy_jj_sl_akshaya_institute',
                    params: {
                        'language_fee':languageFee
                    }
                });

                console.log("Run through document.loc");

            };

            if(fieldId === 'custpage_jj_ai_transaction_currency'){
                let currency = currentRec.getValue('custpage_jj_ai_transaction_currency');
                console.log("Currency is : ",currency);

                //Fetching exchange rate from API endpoint

                // function requestSend() {
                //     let endPointUrl = "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_5jMszTbsSSfJRUMCzOlKbeE6isIYrMSDT9ri8f2F&currencies=USD%2CEUR&base_currency=INR"
                //     let urlLink = http.get({
                //         url: endPointUrl
                //     });
                //     let json = JSON.parse(urlLink);
                //     let data = json['data']

                //     return data;
                // }
                // let exchangeRate = currentRec.setValue({fieldId : 'custpage_jj_ai_exchange_rate', value: requestSend()});
                

                //Exchange rate
                let baseCurrencyAmount = languageFee;
                let rate = currency.exchangeRate({
                    source: 'IND',
                    target: 'USD',
                });
                let exchange = baseCurrencyAmount * rate;
                
                let exchangeRate = currentRec.setValue({fieldId : 'custpage_jj_ai_exchange_rate', value: exchange});
                console.log("Exchange rate is : ",exchangeRate);
            };
        }catch(e){
            log.error("Script error ",e.message);
        }
    }

    return {
        fieldChanged: fieldChanged
    };
    
});
