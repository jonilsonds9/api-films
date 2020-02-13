'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const got = require('got')
const cheerio = require('cheerio')

/**
 * Resourceful controller for interacting with films
 */
class FilmController {
  /**
   * Show a list of all films.
   * GET films
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const html = await got('http://www.adorocinema.com/filmes/todos-filmes/notas-espectadores/')

    const $ = cheerio.load(html.body)

    var result = []

    $('.data_box').each(function(i) {
      var image = $(this)
        .find('.img_side_content')
        .find('span')
        .children('img')
        .attr('src')

      var title = $(this)
        .find('.img_side_content')
        .find('.content')
        .find('.titlebar_02')
        .find('.tt_18')
        .find('a')
        .text()
        .trim()

      var launch_date = $(this)
        .find('.img_side_content')
        .find('.content')
        .find('.list_item_p2v')
        .find('.oflow_a')
        .eq(0)
        .text()
        .trim()

      var ld_separeted = launch_date.split('\n')
      var time = ld_separeted[1].replace('(', '')
      time = time.replace(')', '')

      var director = $(this)
        .find('.img_side_content')
        .find('.content')
        .find('.list_item_p2v')
        .find('.oflow_a')
        .eq(1)
        .text()
        .trim()

      var gender = $(this)
        .find('.img_side_content')
        .find('.content')
        .find('.list_item_p2v')
        .find('.oflow_a')
        .eq(3)
        .text()
        .trim()

      var synopsis = $(this)
        .find('.img_side_content')
        .find('.content')
        .find('p')
        .text()
        .trim()

      result.push({
        id: i,
        image: image,
        title: title,
        director: director,
        gender: gender,
        launch: ld_separeted[0],
        time: time,
        synopsis: synopsis
      })
    })

    // return result
    return response.json({ items: result })
  }
}

module.exports = FilmController
