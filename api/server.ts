import { NowRequest, NowResponse } from '@vercel/node'
import http from 'http'

export default (request: NowRequest, response: NowResponse) => {
  const { url } = request.query

  http.get(url as string, (res) => {
    let html = ''

    res.setEncoding('utf8')

    res.on('data', function (chunk) {
      html += chunk
    })

    res.on('end', function () {
      response.status(200).send(`Hello ${html}!`)
    })
  })
}
