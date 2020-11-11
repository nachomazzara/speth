import { NowRequest, NowResponse } from '@vercel/node'
import https from 'https'
import http from 'http'

export default (request: NowRequest, response: NowResponse) => {
  const { url } = request.query
  const requester = url.indexOf('https://') !== -1 ? https : http
  requester.get(url as string, (res) => {
    let html = ''

    res.setEncoding('utf8')

    res.on('data', function (chunk) {
      html += chunk
    })

    res.on('end', function (e) {
      response.status(200).send(html)
    })
  })
}
