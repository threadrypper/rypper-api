/** @import { EATS_ROUTE } from 'easy-api.ts' */

/**
 * @type {EATS_ROUTE} The route definition for rankcardv1.
 */
const route = {
    url: '/text/owoify',
    method: 'GET',
    code: `
        $c[Authenticate the request.]
        $if[$checkAuthToken[$getHeader[authorization]]==false;
            $reply[
                $setCode[401]
                $setType[json]
                $setBody[{"error": "Unauthorized"}]
            ]
            $stop
        ]

        $c[Checking if "text" is given.]
        $if[$getQuery[text]==null;
            $reply[
                $setCode[400]
                $setType[json]
                $setBody[{"error": "Missing required query parameter: text"}]
            ]
            $stop
        ]

        $c[Getting the text.]
        $let[owoifiedText;$replaceRegex[$replaceRegex[$getQuery[text];(R|L);W;g];(r|l);w;g]]

        $c[Sending the request reply.]
        $reply[
            $setCode[201]
            $setType[json]
            $setBody[{
                "success": "true",
                "original_text": "$getQuery[text]",
                "owoified_text": "$get[owoifiedText]"
            }]
        ]
    `
}

module.exports = { route }
