const ap = new APlayer({
    container: document.getElementById('player'),
    mini: false,
    autoplay: false,
    theme: '#e6d0b2',
    loop: 'all',
    order: 'random',
    preload: 'auto',
    volume: 0.7,
    mutex: true,
    listFolded: true,
    listMaxHeight: 90,
    lrcType: 3,
    audio: [
        {
            name: "夏の喚く",
            artist: '邱有句',
            url: '/mp3/xiadehuan.mp3',
            cover: '/images/xiadehuan.jpg'
        },
        {
            name: "Empty Love",
            artist: 'Lulleaux / Kid Princess',
            url: '/mp3/empty_love.mp3',
            cover: '/images/empty_love.webp'
        },
        {
            name: "Reality",
            artist: 'Janieck Devy',
            url: '/mp3/Reality.mp3',
            cover: '/images/Reality.webp'
        }
    ]
});
