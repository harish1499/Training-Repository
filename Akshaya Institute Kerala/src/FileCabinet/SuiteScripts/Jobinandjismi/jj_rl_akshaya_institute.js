/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record','N/render', 'N/file', 'N/url'],
    /**
 * @param{record} record
 * @param{render} render
 * @param{file} file
 * @param{url} url
 */
    (record, render, file, url) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {

            let documentNumber = requestParams.id;
            log.debug("Document Number of the record ",documentNumber);
            let recordId = parseInt(documentNumber);
            let recordPdf = render.transaction({
                entityId : recordId,
                printMode : render.PrintMode.PDF
            });

            //Create PDF file
            let pdfFile = file.create({
                name: 'Custom Record_'+documentNumber+'_.pdf',
                fileType: file.Type.PDF,
                folder: 613,
                contents: recordPdf.getContents()
            });
            
            //Saving the PDF
            let pdfId = pdfFile.save();
            log.debug("pdfFile is : ",pdfFile)
            log.debug("PDF id is : ",pdfId);
            
            //Converting the PDF into the link
            let pdfLoad = file.load({id:pdfId});

            let pdfLink = 'https://system.netsuite.com' + pdfLoad.url;
            log.debug("PDF Link is : ",pdfLink);

            return pdfLink;

        }


        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {

        }

        return {get, put, post, delete: doDelete}

    });
