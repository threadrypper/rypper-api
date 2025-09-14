/** @import { EATS_ROUTE } from 'easy-api.ts' */

/**
 * @type {EATS_ROUTE} The route definition for rankcardv1.
 */
const route = {
    url: '/canvas/rankcardv1',
    method: 'POST',
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

        $c[Getting and parsing the request body.]
        $createObject[body;$trim[$getBody]]

        $c[Validating the request body.]
        $createArray[requiredValues;username,level,currentXP,requiredXP;,]
        $arrayForEach[requiredValues;
            $c[Checking for the property in the body.]
            $if[$objectIn[body;%element%]==false;
                $c[Reply the request with an error message.]
                $reply[
                    $setCode[400]
                    $setType[json]
                    $setBody[{"error": "Missing required property: %element%"}]
                ]
                $stop $c[Make the code stop.]
            ]
        ]

        $c[Extract parameters from the request body.]
        $let[username;$replaceRegex[$objectProperty[body;username];[^a-zA-Z0-9];;g]]

        $c[Creating the canvas.]
        $createCanvas[
            $c[800x300]
            $setDimensions[800;300]

            $c[Drawing a red background.]
            $color[#FF0000]
            $drawRect[0;0;800;300]

            $c[Loading the background image.]
            $loadImage[background;path;$join[$cwd;/assets/images/wallpaper2.jpg]]

            $c[Validating the image load.]
            $if[$isImage[background]==false;
                $reply[
                    $setCode[500]
                    $setType[json]
                    $setBody[{"error": "Failed to load background image."}]
                ]
                $stop
            ]

            $c[Drawing the background image.]
            $drawImage[background;0;0;800;300]
            $opacity[50]
            $color[#000000]
            $drawRect[0;0;800;300]
            $opacity[100]

            $c[Getting and loading the avatar image.]
            $let[avatarUrl;$if[$objectIn[body;avatarUrl]==false;https://i.imgur.com/AfFp7pu.png;$objectProperty[body;avatarUrl]]]
            $loadImage[avatar;url;$get[avatarUrl]]

            $c[Validating the avatar image load.]
            $if[$isImage[avatar]==false;
                $reply[
                    $setCode[500]
                    $setType[json]
                    $setBody[{"error": "Failed to load avatar image."}]
                ]
                $stop
            ]

            $c[Drawing the avatar image.]
            $drawImage[avatar;50;50;200;200;30]

            $c[Preparing to draw the text in the X axis.]
            $let[baseTextPositionX;300]

            $c[Measuring the last text to draw a background rectangle.]
            $font[30;Arial]
            $createObject[usernameTextMetrics;$measureText[$get[username];object]]

            $c[Drawing a semi-transparent rectangle behind the username.]
            $opacity[30]
            $color[#000000]
            $drawRect[$math[$get[baseTextPositionX] - 10];60;$math[$objectProperty[usernameTextMetrics;width] + 20];$math[$objectProperty[usernameTextMetrics;height] + 20];10]
            $opacity[100]

            $c[Drawing the username text.]
            $color[#FFFFFF]
            $font[30;Arial]
            $drawText[$get[username];$get[baseTextPositionX];60;300;100;left]

            $c[Drawing a semi-transparent rectangle behind the level text.]
            $font[20;Arial]
            $let[levelText;Level: $objectProperty[body;level] | $objectProperty[body;currentXP]/$objectProperty[body;requiredXP] XP]
            $createObject[levelTextMetrics;$measureText[$get[levelText];object]]
            $opacity[30]
            $color[#000000]
            $drawRect[$math[$get[baseTextPositionX] - 10];110;$math[$objectProperty[levelTextMetrics;width] + 20];$math[$objectProperty[levelTextMetrics;height] + 5];10]

            $c[Drawing the level text.]
            $color[#FFFFFF]
            $opacity[100]
            $drawText[$get[levelText];$get[baseTextPositionX];110;300;100;left]

            $c[Drawing the XP progress bar background.]
            $color[#555555]
            $drawRect[$math[$get[baseTextPositionX] - 10];160;400;30;10]

            $c[Calculating the width of the filled part of the progress bar.]
            $let[currentXP;$objectProperty[body;currentXP]]
            $let[requiredXP;$objectProperty[body;requiredXP]]
            $let[progressBarWidth;$math[($get[currentXP]/$get[requiredXP])*400]]

            $c[Drawing the filled part of the progress bar.]
            $if[$get[currentXP]>=15;
                $color[#FFFFFF]
                $drawRect[$math[$get[baseTextPositionX] - 10];160;$get[progressBarWidth];30;10]
            ]
        ]

        $c[Sending the image.]
        $reply[
            $setCode[201]
            $setType[canvas]
            $setBody[%default%]
        ]
    `,
    extraData: {

    }
}

module.exports = { route }
