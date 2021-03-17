# Atelier manager - Prototype app

Was developed a pure frontend app (without backend - prototype) to check the app major functionallity, usability and help to mature the domain design. These result was validated with stakeholder.

## How to run

* With docker-compose:
    
    * (check if volume information is correct in docker-compose.yml file)
```bash
docker-compose up
```

* With docker:

```bash
docker build . -t atelier-manager-node
docker run -p 3000:3000 atelier-manager-node
```

* Or host with installed node and npm:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.