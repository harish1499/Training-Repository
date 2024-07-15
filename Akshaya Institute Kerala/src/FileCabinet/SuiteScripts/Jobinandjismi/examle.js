/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/currentRecord', 'N/record', 'N/search', 'N/runtime'],
    /**
 * @param{currentRecord} currentRecord
 * @param{record} record
 * @param{search} search
 * @param{runtime} runtime
 */
    (currentRecord, record, search, runtime) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
         try{
            let newRec = scriptContext.newRecord.id;
            log.debug("Internal Id is : ",newRec);

            let salesorderSearch = search.create({
                type: "salesorder",
                filters:
                [
                   ['internalid','anyof',newRec]
                ],
                columns:
                [
                   search.createColumn({
                      name: "quantity",
                      summary: "SUM",
                      label: "Quantity"
                   })
                ]
             });

              //Running search
              let sum = 0;
              let searchRun = salesorderSearch.run().each(function(result){
                sum = result.getValue({name : 'quantity', summary :'SUM'});
                return false;
            });
            log.debug("Sum is ",sum);
            return sum;

        }catch(e){
            log.error("Error found",e.message);
        }
      }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {


        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
