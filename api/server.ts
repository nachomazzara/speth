import { NowRequest, NowResponse } from '@vercel/node'
import https from 'https'
import http from 'http'

export default (request: NowRequest, response: NowResponse) => {
  const { url } = request.query
  try {
    const requester = url.indexOf('https://') !== -1 ? https : http
    requester.get(url as string, (res) => {
      let html = ''

      res.setEncoding('utf8')

      res.on('data', function (chunk) {
        html += chunk
      })

      res.on('error', function (e) {
        response.status(502).send(`Failed to fetch ${url}: ${e.message}`)
      })

      res.on('end', function () {
        response.status(200).send(html)
      })
    })
  } catch (e) {
    return response.status(502).send(`Failed to fetch ${url}: ${e.message}`)
  }
}
