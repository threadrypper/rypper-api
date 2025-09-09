module.exports.route = {
    url: '/protected',
    method: 'POST',
    code: `
        $c[Prevent unauthorized access.]
        $if[$checkAuthToken[$getHeader[authorization]]==false;
            $reply[
                $setCode[401]
                $setType[json]
                $setBody[{"error": "Unauthorized"}]
            ]
            $stop
        ]

        $c[Reply with success.]
        $reply[
            $setCode[200]
            $setType[json]
            $setBody[{"message": "You have accessed a protected route!"}]
        ]
    `
}