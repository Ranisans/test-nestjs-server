# Тестовое задание Back-end.

1. таблица user - поля: (email, firstName, lastName, image(string), pdf(binary))
2. crud операции над user
3. загрузка картинки на сервер
4. создать post запрос на который генерируется pdf юзера который находится по email(передать в теле)
5. далее функция находит пользователя в базе по email
6. генерит pdf файл вида firstName + lastName + image
7. сохраняет pdf файл в поле pdf базы данных- возвращает пользователю результат в виде JSON (true/false).
<br/><br/>
## **ATTENTION !!!**
The repo has a filled .env.development **ONLY FOR QUICK TESTING**. In all projects, similar files are in **.gitignore**
<br/>
## Running the app
Run in your terminal:
* clone this repo 
  * *git clone https://github.com/Ranisans/test-nestjs-server*
* in repo folder
  * *yarn install*
* run your docker and run command
  * docker-compose up -d
* run migrations DB
  * yarn typeorm:run:dev
* run server
  * yarn run:dev
* after all, shutdown docker images
  * docker-compose down

    <br/>
## Api:

All endpoints, except *log-in* and *register*, require jwt cookie
### Authentication
  * Post authentication/register - for create a user
    * accept 
      * email
      * firstName
      * lastName
      * password
    <br/>
    * return **jwt** cookie if creating a user is successful
  <br/><br/>
  * Post authentication/log-in - for log in 
    * accept 
      * email
      * password
    <br/><br/>
    * return 'Authentication' **jwt** cookie if authentication is successful 
  <br/><br/>
  * Post authentication/log-out - for log out 
    * return empty 'Authentication' cookie
  <br/>

### User
  * Get users/:id - return user by id if exist 
    * accept jwt cookie
    * return user if exist
  <br/><br/>
  * Get users/pdf - return pdf file if created 
    * accept 
      * email
      <br/>
    * return pdf file if file and user exist 
  <br/><br/>
  * Post users/update-image - add image url to user 
    * accept 
      * imageUrl
  <br/><br/>
  * Post users/generate-pdf - generates pdf file 
    * ... if image and user's data exist, and store it to DB
  <br/><br/>
  * Patch users/ - update user data 
    * accept 
      * firstName - optional
      * lastName - optional
      * password - optional
  <br/><br/>
  * Patch users/password - update user password 
    * accept 
      * password
    * return user data 
  <br/><br/>
  * Delete users/ - delete user 
    * remove a user with id from **jwt** cookie