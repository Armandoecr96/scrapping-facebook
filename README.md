##Data

It is a package dedicated to the easy extraction of data from commercial pages of facebook.

##Features
- Basic information on company Facebook pages
- Gallery on company Facebook pages
- It only works for the English and Spanish versions of Facebook

##Installation

First download the npm library of data:
``` bash
npm install data.js --save
```

##Usage

```js
const data = requiere('./data')

//Receive the set of images from the facebook page
data.gallery(facebookURL)
	.then(res => console.log(res))
    .catch(console.err)
    
//Reveive the set of basic information from the facebook page
data.information(facebookURL)
	.then(res => console.log(res))
    .catch(console.err)
```

- `facebookURL` is the url taken from the start of the facebook business page to evaluate

###Return

This is the way to recive the information from information function
```
{ 
	bussinesInformation:
	{
		name: StringName,
		logo: logoURL,
		payment: [ credit card acept],
		phone: CellPhone,
		description: Desrcription 
	},
	ubication:
	{
		latitude: Latitude,
		longitude: longitude,
		address: Address,
		city: City 
	},
	categories: 
	{ 
		categories: Category,
		subcategories: Subcategory 
	},
	schedule: 
	{ 
		hour: [open - close],
		days: [days] 
	} 
}
```
- `credit card acept` It is the set of types of cards accepted in the company
- `open-close` It is the set of all available schedules provided by the facebook page.

- `days` It is the set of all available days provided by the facebook page
- The set of schedules corresponds to the set of days

**Note:** There is an error that makes the information of hours and days of the week not always available. 

This is the way to recive the information from gallery function
```
  var jsonGal = 
 { gallery:   
 	[ 	 
     { img: URLimage },
     { img: URLimage },
     { img: URLimage },
     { img: URLimage },
     { img: URLimage }
     ]
  }
```
For the individual view of each one of url obtained from the gallery we use the following function

```js
data.gallery(facebookURL).then(res => console.log(res.gallery[0].img))
```

The information that does not exist on the facebook page will be represented as a String without characters. It is represented in this way: 

```
categories: 
{ 
	categories: '',
	subcategories: '', 
}
```


