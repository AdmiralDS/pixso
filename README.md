# Pixso Tokens Extractor

## Описание
Этот скрипт предназначен для автоматического извлечения токенов (данных тем) из Pixso. Он позволяет разработчикам различных платформ (Web, Mobile, iOS, Android, Flutter) получать данные о цветах и тенях в удобном формате, без необходимости вручную копировать значения.

## Конфигурация

Скрипт использует массив объектов с настройками. Каждый объект массива описывает правила для форматирования выгружаемых данных в итоговый файл, количество элементов массива соответствует количеству файлов, в которых появятся данные. Результатом работы скрипта будет являться содержимое переменной с названием, которое будет указано для поля name. Массив items хранит описание правил для данных каждой перменой. Пример:

```json
[
  {
    "platform": "WEB",
    "outputFilePath": "path/to/file.ts",
    "items": [
      {
        "type": "COLOR",
        "name": "primaryColor",
        "apiBaseUrl": "https://api.pixso.com",
        "fileKey": "someFileKey",
        "transformRules": {
          "removePercent": true,
          "keepOnlyFirstUnderscore": false,
          "sort": true,
          "namingConvention": "camelCase"
        }
      }
    ]
  }
]
```

## Использование

```sh
npx @admiral-ds/pixso-cli@latest run
```
или
```sh
npx @admiral-ds/pixso-cli@latest json
```

После запуска скрипта начнётся диалог с пользователем для настройки параметров выгрузки.

### Процесс работы

1. **Выбор платформы**
   ```
   Choose platform:
   1 - WEB
   2 - MOBILE
   3 - IOS
   4 - ANDROID
   5 - FLUTTER
   ```
   Введите число, соответствующее нужной платформе.

2. **Указание пути к файлу**
   ```
   Enter the output file path with file extension, like color.dark.ts or color.dark.swift:
   ```
   Введите абсолютный путь до существующего файла, куда будут записаны данные.

3. **Добавление переменных**
   
   - Выбор типа данных:
     ```
     Enter item type (COLOR or SHADOW):
     ```
     Введите `COLOR` или `SHADOW`.
   
   - Указание имени переменной:
     ```
     Enter name (e.g., color or boxShadow):
     ```
     Введите название переменной.

   - Указание API URL:
     ```
     Enter API URL (e.g., https://pixso.t1-pixso.ru):
     ```
     Введите URL API.

   - Указание fileKey (e.g., uSjNAVkKdwGPfIy3S72-cA для светлой или iz8Z0ubn2rLfpEcJQD__tg для тёмной тем):
     ```
     Enter fileKey:
     ```
     Введите идентификатор файла в дизайнерской системе.

   - Шаблонный путь (если не нужен, нажмите Enter):
     ```
     Enter template path (leave empty if not needed):
     ```
   
   - Опции форматирования:
     ```
     Remove percentage from names? (true/false):
     ```
     ```
     Keep only the first underscore? (true/false):
     ```
     ```
     Sort items? (true/false):
     ```
     ```
     Choose a naming convention:
     1 - camelCase
     2 - PascalCase
     3 - snake_case
     4 - SCREAMING_SNAKE_CASE
     5 - kebab-case
     6 - flatcase
     7 - none
     ```
     Введите число, соответствующее нужному формату.

4. **Добавление дополнительных переменных**
   ```
   Add another item? (yes/no)
   ```
   Если `yes`, повторите шаги 3.1–3.8.

5. **Добавление другой темы (например, тёмной)**
   ```
   Add another theme? (yes/no)
   ```
   Если `yes`, повторите шаги 1–4.

## Итог
После завершения работы скрипта в указанные файлы будут записаны объекты с токенами, готовыми к использованию.

Пример результата:

```ts
export const themeColors = {
  primary: "#FF5733",
  secondary: "#33FF57"
};
```

Теперь вы можете легко получать данные тем из Pixso в нужном формате!
