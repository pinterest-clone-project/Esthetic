<div align="center">

# 🏗️ ARCHITECTURE

<p align="center">
  <img src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fzyagf5739mo4qzwgu7nz.png" width="48%" alt="Architecture Schema 1" />
  <img src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*UWu9pbyPyHvkbmWaznYMXg.png" width="48%" alt="Architecture Schema 2" />
</p>

---

### 🎯 Мета
Коротко пояснити, хто за що відповідає в архітектурі проекту та показати детальний шлях даних від клієнта до бази і назад

</div>

## 📂 Структура шарів

### 1️⃣ Domain
**Доменний рівень — серце програми.** Він описує поведінку бізнес-об'єктів і містить тільки бізнес-модель, без прив'язки до бази даних або фреймворків.

* **Суб'єкти (domain entities)** — наприклад `Domain/Entities/Identity/UserEntity.cs`.
* **Об'єкти-значення (value objects)** — якщо потрібні, тримати поруч з доменом.
* **Події домену (domain events)** — наприклад, `MessageSentEvent` для повідомлень (за потреби додаються у `Domain/Events`).

> [!IMPORTANT]
> **Правило:** домен нічого не знає про API, БД чи інфраструктурні сервіси.

**Приклад із проекту:**
`UserEntity` в `Domain/Entities/Identity/UserEntity.cs` описує що таке користувач у бізнес-контексті (ім'я, email, bio, roles тощо).

---

### 2️⃣ Application
Цей шар визначає варіанти використання системи (**UseCases**). Він управляє бізнес-операціями, але не реалізує технічні деталі.

* **Команди/Запити (Commands/Queries)** — інкапсулюють дії, наприклад `Application/UseCases/Users/Commands/CreateUserCommand.cs`.
* **Handler-и** — виконують логіку UseCase, напр. `Application/UseCases/Users/Handlers/CreateUserHandler.cs`.
* **DTO (request/response)** — контракти між клієнтом і API: `Application/UseCases/Users/Dto/CreateUserRequest.cs`, `UserDto.cs`.
* **Інтерфейси (порти)** — наприклад `Domain/Interfaces/IUserRepository.cs` (контракт для репозиторію).
* **AutoMapper профілі** — `Application/Mappers/UserMapper.cs` (мапінги DTO ↔ Entity).

**Принцип залежностей:** Application залежить від Domain, але не від Infrastructure.

**Типовий flow у шарі Application:**
1. Контролер відправляє `CreateUserCommand(CreateUserRequest)` через MediatR.
2. Handler мапить DTO → Entity (AutoMapper), викликає репозиторій через інтерфейс, повертає `UserDto`.

---

### 3️⃣ Infrastructure
Інфраструктура реалізує технічні деталі: доступ до БД, зовнішні сервіси, файлове сховище.

* `Infrastructure/Data/AppDbContext.cs` — EF Core DbContext.
* **Репозиторії** — реалізаціїпортів, напр. `Infrastructure/Data/Repositories/UserRepository.cs` реалізує `IUserRepository`.
* **Інтеграції зовнішніх API, сервіси:** `Infrastructure/Services/*` (ImageService, JwtTokenService, SmtpService).
* Quartz jobs, міграції, інші технічні реалізації.

> **Правило:** інфраструктура знає про домен і application (виконує їхні контракти), але домен/додаток не знають про інфраструктуру.

---

### 4️⃣ API
**Рівень презентації — точка входу в систему.** Він відповідає лише за HTTP/маршрути та перетворення запиту в команду/запит для Application.

* **Контролери:** `backend-pinterest/Controllers/UsersController.cs` — біндять DTO з тіла запиту і викликають MediatR.
* **Middleware:** JWT/Authentication, глобальний exception handler, CORS.

**Правила:**
* Контролер не містить бізнес-логіки — він викликає Application (через MediatR).
* Контролер повертає DTO (не доменні ентіті).

---

## 🔄 Повний шлях даних

Тут візуалізовано логіку проходження запиту через шари архітектури.

```mermaid
graph LR
    A[Client] -->|POST /api/users| B(API Controller)
    B -->|Send Command| C(Application Handler)
    C -->|Map & Save| D(Infrastructure / DB)
    D -->|Return Entity| C
    C -->|Return DTO| B
    B -->|201 Created| A
````````

## 🧰 Redis — швидкий старт і перевірка

В цьому проекті Redis використовується як `IDistributedCache` (StackExchange.Redis). Нижче інструкція як швидко підняти Redis локально через Docker та як працювати з ним через `redis-cli`.

### 1) Запустити Redis через Docker

Відкрийте термінал (CMD або PowerShell) і виконайте:

```bash
docker run --name my-redis -p 6379:6379 -d redis
```

Це завантажить образ Redis і запустить його на порту `6379`.

### 2) Перевірити, чи Redis працює

```bash
docker exec -it my-redis redis-cli ping
```

Якщо отримаєте `PONG` — Redis працює.

### 3) Консольний доступ (redis-cli)

Підключитися до контейнера:

```bash
docker exec -it my-redis redis-cli
```

Подивитися всі ключі у базі:

```bash
keys *
```

Отримати значення конкретного ключа:

```bash
get "Pinterest_users:all"
```

### 4) Режим реального часу (monitor)

Якщо хочете бачити в реальному часі команди, які ваш додаток надсилає в Redis (GET/SET), у консолі `redis-cli` запустіть:

```bash
monitor
```

Потім зробіть запит у браузері або Postman — в консолі з'являться відповідні команди.