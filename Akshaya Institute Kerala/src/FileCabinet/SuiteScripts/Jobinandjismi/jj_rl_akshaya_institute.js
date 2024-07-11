/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record','N/render', 'N/file'],
    /**
 * @param{record} record
 * @param{render} render
 * @param{file} file
 */
    (record, render, file) => {
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

            // let fileTemplate = file.load({id: documentNumber})
            // Create PDF
            // let render = render.create();
            // render.templateContent = templateFile.getContents();
            // render.addRecord('record', customRecord);

            // let pdfFile = render.renderAsPdf();
            // pdfFile.name = 'CustomRecord_' + recordId + '.pdf';
            // pdfFile.folder = 613;
            // let pdfFileId = pdfFile.save();

            // // Create the URL for the PDF file
            // let pdfUrl = url.resolveRecord({
            //     recordType: 'file',
            //     recordId: pdfFileId,
            // });

            log.debug("PDF attachment",recordPdf);
            return recordPdf;

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
