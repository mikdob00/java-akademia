const s = require('../server.js');
(async () => {
  console.log(s.findJdk());
  const files = [{name:'Main.java', code:'public class Main { public static void main(String[] a){ System.out.println("Zażółć gęślą jaźń " + new java.util.Scanner(System.in).nextLine()); } }'},
                 {name:'Zwierze.java', code:'public class Zwierze { public String imie; private int waga; public Zwierze(String i,int w){imie=i;waga=w;} public int getWaga(){return waga;} }'}];
  console.log(JSON.stringify(await s.runProgram({files, stdin:'hej\n'})));
  const checks = [
    {code:'Zwierze z = new Zwierze("Azor",60); eq("Azor", z.imie); eq(60, z.getWaga());'},
    {code:'isTrue("waga prywatna", Modifier.isPrivate(fieldMods("Zwierze","waga")));'},
    {code:'Zwierze z = new Zwierze("A",1); z.nieMaTakiej();'},
    {code:'eq(5, 6);'},
    {code:'Object o = make("Zwierze","Rex",5); eq(5, call(o,"getWaga"));'},
    {code:'while(true){}'},
    {code:'Object x = null; x.toString();'},
  ];
  console.log(JSON.stringify(await s.runCheck({files, checks}), null, 1));
  files[1].code = files[1].code.replace('int waga;', 'int waga');
  console.log(JSON.stringify(await s.runCheck({files, checks})).slice(0,600));
})();
