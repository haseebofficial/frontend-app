((d, w, c) ->
  (w[c] = w[c] or []).push ->
    try
      w.yaCounter22175668 = new Ya.Metrika(
        id: 22175668
        webvisor: true
        clickmap: true
        trackLinks: true
        accurateTrackBounce: true
        trackHash: true
      )
    return

  n = d.getElementsByTagName("script")[0]
  s = d.createElement("script")
  f = ->
    n.parentNode.insertBefore s, n
    return

  s.type = "text/javascript"
  s.async = true
  s.src = ((if d.location.protocol is "https:" then "https:" else "http:")) + "//mc.yandex.ru/metrika/watch.js"
  if w.opera is "[object Opera]"
    d.addEventListener "DOMContentLoaded", f, false
  else
    f()
  return
) document, window, "yandex_metrika_callbacks"

