# Easy Share (backend API)

_Easy Share application is a project that lets you share files on the go. <br/>
Share files anytime and anywhere via our email functionality or directly using the link._

_A [backend api](https://github.com/VirajPatidar/easy-share-backend) has been built using **Express.js** to achieve the same._

<br/>

**Link to the website:** [https://easy-file-share.netlify.app/](https://easy-file-share.netlify.app/) <br/>

**Link to frontend repo:** [https://github.com/VirajPatidar/easy-share-frontend](https://github.com/VirajPatidar/easy-share-frontend)


### Tech Stack ###
* Node.js
* Express.js
* MongoDB
* Nodemailer
* EJS
* Multer



### API Endpoints ###
| Method | API Endpoint | Description |
| :---         | :---         | :---         
| `POST`   | `/files`     | To upload the file to be shared    |
| `GET`     | `/files/:id`       |  To get the download page of the shared file      |
| `POST`     | `/files/send`       |  To share the file via email     |

<br/>
