Az app futtatásához létre lett hozva egy új akciok nevű git repo.
https://github.com/balagex/akciok

Alapvetően a https://www.youtube.com/watch?v=F3HbnbT1Maw videó alapján mentek a dolgok az alábbi megjegyzésekkel.

- A git clone-nal itt is egy üres könyvtárba lett a repo klónozva (`clone https://github.com/balagex/akciok.git`), majd itt létrehozva egy új app külön alkönyvtár kreálás nélkül (`ng new akciok --directory ./`).
- Ha az `ng build --output-path docs --base-href /akciok/` parancsot futtatjuk, akkor az angular projekt könyvtárban egy **docs** könyvtár alá jön létre a **dist** helyett a futtatandó állomány halmaz. Az angular 17 verzió-ban azonban bekerül egy **browsers** nevű alfolder alá minden, ahonnan kézzel fentebb kell mozgatni a docs alá.
- A base-ref rész azért kell, hogy az index.html-ben a base tag href attribútuma "/akciok/" értéket kapjon. Ha ezt elfelejtjük, akkor a github-os build/deploy után jönni fog több olyan hiba, hogy pl. *Loading module from “https://balagex.github.io/polyfills-RX4V3J3S.js” was blocked because of a disallowed MIME type (“text/html”)Loading module from “https://balagex.github.io/polyfills-RX4V3J3S.js” was blocked because of a disallowed MIME type (“text/html”)*.
- git telepítésre került a windows-ra innen: https://git-scm.com/downloads
- A `git remote add origin https://github.com/balagex/akciok.git` parancs ki lett adva a projekt könyvtárban.
- `git add .` és a `git commit -m "valami üzenet"` parancsokkal megtörténik a local commit, de ezt még push-olni kell a repoba.
- A videóban látott módon ez nem megy, mert már nem lehet sima jelszóval ezt tenni (*Support for password authentication was removed on August 13, 2021.* hiba jött), ezért egy másik videó segített abban, hogyan kell ezt egy token generálással megoldani. https://www.youtube.com/watch?v=6-FohH_jGLI
- Be kellett még állítani a git user paramétereket a 
  `git config --local user.email "csongebalazs@gmail.com"`
  `git config --local user.name "balagex"`
- A vgit config credential.helper store` parancs kiadása kellett a video alapján, majd a következő vgit push -u origin main` esetén a tokent kellett megadni a jelszó helyett.
- A próbálkozások során létrehoztam egy a bevesárló listás repo alapján egy **gh-pages** nevű branch-et, ami a master tartalmával jött létre. A gépemen is átléptem erre a branchre.
  `git checkout`
  `git checkout -b gh-pages`
- Az új branchre már másik push parancs volt:
  `git push --set-upstream origin gh-pages`
- A gitlab oldalán pedig a *repo settings / Pages / Build and deployment* alatt be lett állítva, hogy "Deploy from a branch", valamint a gh-pages /docs és Save. Ekkor commit után idővel indul a deploy és itt megnézhető a végeredmény: https://balagex.github.io/akciok/
