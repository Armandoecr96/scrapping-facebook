const puppeteer = require('puppeteer');

exports.information = async function information(facebookPage) {
    const browser = await puppeteer.launch({
        headless: true
    });

    const page = await browser.newPage();
    await page.waitFor(1000);

    await page.goto(facebookPage + 'about/?ref=page_internal');
    try {
        await page.click('#u_0_o > div._4bl9 > i')
    } catch (err) {
        console.log("Error")
    }
    const information = await page.evaluate(() => {
        let info = []
        let arrayInformation = Array.from(document.querySelectorAll('._1xnd ._4bl9 div'));
        let category = Array.from(document.querySelectorAll('._2piu ._1xnd ._4bl9 a'));
        let payment = Array.from(document.querySelectorAll('._4bl9 i'));
        let schedule = Array.from(document.querySelectorAll('._54nh'));

        let title = document.querySelector('._64-f').textContent;

        let logo = document.querySelector('._4jhq').src;
        info.push(category.map(cat => cat.textContent));
        info.push(arrayInformation.map(info => info.textContent))
        info.push(title, logo)
        try {
            let map = document.querySelector('._4j7v img').src;
            info.push(map)
        } catch (err) {
            info.push('')
        }
        info.push(payment.map(pay => pay.className));
        info.push(schedule.map(sch => sch.textContent))
        return (info)
    });
    browser.close();

    //Category
    var categories = information[0][information[0].length - 1];
    var subcategories = information[0][information[0].length - 2];

    //Information
    var name = information[2];
    var logo = information[3];

    //Payment
    var methodPaid = [];
    for (let i = 0; i < information[5].length; i++) {
        if (information[5][i] == '_3-8_ img sp_ri3k8PFTekh_1_5x sx_4cbbd5' || information[5][i] == '_3-8_ img sp_ri3k8PFTekh sx_84b1fd') {
            methodPaid.push("American Express");
        }
        if (information[5][i] == '_3-8_ img sp_ri3k8PFTekh_1_5x sx_9ab5b0' || information[5][i] == '_3-8_ img sp_ri3k8PFTekh sx_1c3f5c') {
            methodPaid.push("Visa");
        }
        if (information[5][i] == '_3-8_ img sp_ri3k8PFTekh_1_5x sx_cc2dd6' || information[5][i] == '_3-8_ img sp_ri3k8PFTekh sx_92ef7a') {
            methodPaid.push("Master Card");
        }
    }

    //Maps
    try {
        var longitude;
        var latitude;
        var direction = information[4].split("&");
        for (let i = 0; i < direction.length; i++) {
            if (direction[i].includes('markers=')) {
                var dir = direction[i].split("%2C")
                latitude = dir[0].replace('markers=', '');
                longitude = dir[1];
            }
        }
    } catch (err) {
        latitude = null
        longitude = null
    }

    //Address
    var address
    var city
    if (latitude != null || latitude != undefined) {
        address = information[1][0];
        city = information[1][1];
    } else {
        address = ''
        city = ''
    }

    //Call & Description
    var call
    var description
    for (let i = 0; i < information[1].length; i++) {
        var esCall = information[1][i].includes("Llamar");
        var enCall = information[1][i].includes("Call");
        var esDes = information[1][i].includes("Descripción");
        var enDes = information[1][i].includes("About");

        if (esCall) {
            call = information[1][i].split("Llamar ");
        }
        if (enCall) {
            call = information[1][i].split("Call ");
        }
        if (esDes || enDes) {
            description = information[1][i + 1];
        }

    }

    //Phone
    try {
        var phone = call[1];
        var hour = schedule.split("-");
    } catch (err) {
        hour = ['', '']
    }

    var day = []
    var hour = []
    for (let i = 0; i < information[6].length; i++) {
        let datetime = information[6][i].split(': ')
        day.push(datetime[0])
        hour.push(datetime[1])
    }
    //JSON file
    var jsonInfo = {
        "bussinesInformation": {
            "name": name,
            "logo": logo,
            "payment": methodPaid,
            "phone": phone,
            "description": description
        },
        "ubication": {
            "latitude": latitude,
            "longitude": longitude,
            "address": address,
            "city": city
        },
        "categories": {
            "categories": categories,
            "subcategories": subcategories
        },
        "schedule": {
            "hour": hour,
            "days": day
        }
    }

    return (jsonInfo);
}

exports.gallery = async function gallery(facebookPage) {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(facebookPage + 'photos/?ref=page_internal');
    await page.waitForSelector('._2eea img');
    const gallery = await page.evaluate(() => {
        let image = []
        let photos = Array.from(document.querySelectorAll('._2eea img'));

        image.push(photos.map(ph => ph.src));

        return (image)

    });
    browser.close()

    for (let i = 0; i < gallery[0].length; i++) {
        if (gallery[0][i] == "https://www.facebook.com/images/photos/profile/gradient.png") {
            gallery[0].splice(i, 1)
        }
    }

    var jsonGal = {
        "gallery": []
    }

    for (let i = 0; i < gallery[0].length; i++) {
        jsonGal.gallery.push({
            'img': gallery[0][i]
        })
    }

    return jsonGal;
}