const puppeteer = require('puppeteer');
const translate = require('translate');

(async () => {

    //var facebookPage = document.getElementById("facebookPage").value;
    //console.log(facebookPage)
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    
    await page.goto('https://www.facebook.com/AluxPlayaDelCarmen/');
    await page.waitFor(1000);

    await page.goto('https://www.facebook.com/pg/AluxPlayaDelCarmen/about/?ref=page_internal');
    //await page.click('#u_0_g > div:nth-child(3) > a')
    const information = await page.evaluate(() => {
        let info = []
        let arrayInformation = Array.from(document.querySelectorAll('._1xnd ._4bl9 div'));
        let category = Array.from(document.querySelectorAll('._2piu ._1xnd ._4bl9 a'));
        let payment = Array.from(document.querySelectorAll('._1xnd ._4bl9 i'));

        let title = document.querySelector('._64-f').innerText;
        //let menu = Array.from(document.querySelectorAll('div a'));
        let map = document.querySelector('._4j7v img').src;
        let logo = document.querySelector('._4jhq').src;
        info.push(category.map(cat => cat.textContent));
        info.push(arrayInformation.map(info => info.textContent))
        info.push(title, logo, map)
        info.push(payment.map(pay => pay.className));
        //info.push(menu.map(m => m.href));
        return (info)
    });
    await page.goto('https://www.facebook.com/pg/AluxPlayaDelCarmen/photos/?ref=page_internal');
    //await page.click('#u_0_g > div:nth-child(4) > a')
    await page.waitForSelector('._2eea img');
    const gallery = await page.evaluate(() => {
        let image = []
        let photos = Array.from(document.querySelectorAll('._2eea img'));

        image.push(photos.map(ph => ph.src));

        return (image)

    });

    //Category
    var categories = information[0][4];
    var subcategories = information[0][3];

    //Information
    var name = information[2];
    var logo = information[3];    

    //Adrress
    var address = information[1][0];
    var city = information[1][1];

    //Payment
    var methodPaid = [];
    for (let i = 0; i < information[5].length; i++) {
        if(information[5][i] == '_3-8_ img sp_ri3k8PFTekh_1_5x sx_4cbbd5'){
            methodPaid.push("American Express");
        }
        if(information[5][i] == '_3-8_ img sp_ri3k8PFTekh_1_5x sx_9ab5b0'){
            methodPaid.push("Visa");
        }
        if(information[5][i] == '_3-8_ img sp_ri3k8PFTekh_1_5x sx_cc2dd6'){

            methodPaid.push("Master Card");
        }
    }

    //Maps
    var longitude;
    var latitude;
    var direction = information[4].split("&");
    for (let i = 0; i < direction.length; i++) {
        if(direction[i].includes('markers=')){
            var dir = direction[i].split("%2C")
            latitude = dir[0].replace('markers=', '');
            longitude = dir[1];
        }
    }
    //Phone & Schedule
    var schedule
    var call
    var description
    for (let i = 0; i < information[1].length; i++) {
        if(information[1][i].includes("Llamar")){
            call = information[1][i].split("Llamar ");
        }
        if(information[1][i].includes("Cerrado ahora") || information[1][i].includes("Abierto ahora") || information[1][i].includes("Abre") || information[1][i].includes("Cierra")){
            schedule = information[1][i+1];
        }
        if(information[1][i].includes("Descripción")){
            description = information[1][i+1];
        }

    }
    var phone = call[1];
    var hour = schedule.split("-");

    for (let i = 0; i < gallery[0].length; i++) {
        if (gallery[0][i] == "https://www.facebook.com/images/photos/profile/gradient.png") {
            gallery[0].splice(i, 1)
        }
    }
    /*
    console.log("Categories: " +categories + "\nSubcategories: " +subcategories);
    console.log("Name:" + name + "\nLogo: " + logo);
    console.log("Hora: " + hour[0] + " - " + hour[1]);
    console.log("Dirección: " + address + "Ciudad: " + city);
    console.log("Telefono: " + phone);
    console.log("Descripcion:" + description);
    console.log("Latitude: " + latitude + "\nLongitude: " +  longitude)
    console.log("Metodos de Pago: " + methodPaid)

    /*
    for (let i = 0; i < gallery[0].length; i++) {
        console.log(gallery[0][i])
    }
*/
console.log(information[5])
    //browser.close();
})();