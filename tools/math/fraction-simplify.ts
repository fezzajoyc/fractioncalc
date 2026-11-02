import { SimplifyEngine } from "../_engines/engine-fraction-simplify";
import { defineTool } from "../_lib/types";

export default defineTool({
  slug: "fraction-simplify",
  category: "utility",
  icon: "check",
  engine: { component: SimplifyEngine },
  related: ["fraction-add-subtract", "fraction-multiply-divide", "fraction-decimal", "fraction-mixed"],
  copy: {
    en: {
      name: "Simplify Fractions",
      tagline:
        "Reduce any fraction to lowest terms with the GCD shown — plus the decimal value and the mixed-number form for improper fractions.",
      intro: [
        "8/12 and 2/3 name the same amount, but only 2/3 is the form teachers, recipes and answer keys expect. This calculator finds the greatest common divisor of the numerator and the denominator, divides both by it, and shows exactly which number did the cancelling. If the fraction is already in lowest terms it says so, instead of pretending to simplify something.",
        "Improper fractions come back with a bonus: 14/6 simplifies to 7/3 and reads as the mixed number 2 1/3. The decimal value is included so you can sanity-check the size at a glance — 0.333… is clearly a third.",
      ],
      steps: [
        "Enter the numerator and the denominator.",
        "Read the simplified fraction next to your input.",
        "Check the GCD line to see the number used to cancel.",
        "Look at the decimal and the mixed number to sense the size.",
      ],
      faqs: [
        {
          q: "How does the tool find the GCD?",
          a: "With the Euclidean algorithm: divide the larger number by the smaller, replace it by the remainder, and repeat until the remainder is zero. For 36 and 48 the remainders run 36, 12, 0 — so the GCD is 12 and 36/48 = 3/4.",
        },
        {
          q: "Why simplify a fraction at all?",
          a: "Lowest terms are the shared convention: answer keys, scaled recipes and measurements all quote 2/3, not 34/51. Simplified fractions are also easier to compare — spotting that 4/6 equals 2/3 takes a moment, but 2/3 next to 2/3 is instant.",
        },
        {
          q: "Can simplifying change the value?",
          a: "Never. Dividing the numerator and the denominator by the same non-zero number keeps the value identical; it only changes how the fraction is written. Zero works too: 0/40 simplifies to 0/1, still zero.",
        },
        {
          q: "What about negative fractions?",
          a: "The sign always ends up in the numerator: −8/12 and 8/−12 both simplify to −2/3. A negative denominator is never shown, which is the standard written form.",
        },
      ],
    },
    zh: {
      name: "分数化简计算器",
      tagline: "把任意分数约到最简,并显示所用的最大公约数——附小数值,假分数同时给出带分数形式。",
      intro: [
        "8/12 和 2/3 表示同一个数,但老师、菜谱和答案要求的写法是 2/3。本计算器求出分子分母的最大公约数,同除之后展示到底是哪个数在约分。如果分数已经是最简,它会直说,而不是假装约了一遍。",
        "假分数还附带转换:14/6 约成 7/3,并读作带分数 2 1/3。小数值一并列出,便于一眼核对大小——0.333… 显然是三分之一。",
      ],
      steps: [
        "输入分子和分母。",
        "在输入旁边查看化简结果。",
        "看 GCD 一行,确认约分用的数。",
        "用小数和带分数核对大小。",
      ],
      faqs: [
        {
          q: "工具怎么求最大公约数?",
          a: "用辗转相除法:大数除以小数,用余数替换,直到余数为 0。36 和 48 的余数依次是 36、12、0,所以 GCD 是 12,36/48 = 3/4。",
        },
        {
          q: "为什么要化简分数?",
          a: "最简分数是共同约定:答案、食谱换算、测量都用 2/3 而不是 34/51。化简后的分数也更容易比较——看出 4/6 等于 2/3 要想一想,但 2/3 和 2/3 一眼就知道相等。",
        },
        {
          q: "化简会改变数值吗?",
          a: "不会。分子分母同除以同一个非零数,值完全不变,只是写法变了。0 也一样:0/40 化简为 0/1,仍是零。",
        },
        {
          q: "负分数怎么处理?",
          a: "负号总是落在分子上:−8/12 和 8/−12 都化简为 −2/3。分母不会显示为负,这是标准书写形式。",
        },
      ],
    },
    ja: {
      name: "分数の約分",
      tagline: "任意の分数を最大公約数で既約形に。使用した GCD と小数値を表示し、仮分数は帯分数の形も示します。",
      intro: [
        "8/12 と 2/3 は同じ量を表しますが、答えやレシピで求められる書き方は 2/3 です。この計算機は分子と分母の最大公約数を求めて両方を割り、どの数で約分したかを正確に示します。すでに既約の分数には、約分したふりをせずはっきりそう伝えます。",
        "仮分数はおまけ付きです。14/6 は 7/3 に約分され、帯分数 2 1/3 としても読めます。小数値も併記するので、大きさの見当もすぐつきます。0.333… は明らかに 1/3 です。",
      ],
      steps: [
        "分子と分母を入力します。",
        "入力のそばに既約の分数が表示されます。",
        "GCD の行で、約分に使った数を確認します。",
        "小数と帯分数で大きさを確かめます。",
      ],
      faqs: [
        {
          q: "GCD はどうやって求めていますか?",
          a: "ユークリッドの互除法です。大きい数を小さい数で割り、余りで置き換えて余りが 0 になるまで繰り返します。36 と 48 なら余りは 36、12、0 と進むので GCD は 12、36/48 = 3/4 です。",
        },
        {
          q: "なぜ約分するのですか?",
          a: "既約形が共通の約束だからです。模範解答もレシピの倍率も測定値も 34/51 ではなく 2/3 と書きます。約分済みの分数は比較もしやすく、4/6 が 2/3 と等しいと見抜くには一瞬考えますが、2/3 と 2/3 なら一目です。",
        },
        {
          q: "約分で値は変わりますか?",
          a: "変わりません。分子と分母を同じ 0 でない数で割れば値はそのままで、書き方が変わるだけです。0 も同様で、0/40 は 0/1 に約分されてもやはり 0 です。",
        },
        {
          q: "負の分数は?",
          a: "符号は必ず分子に来ます。−8/12 も 8/−12 も −2/3 に約分されます。分母が負の表示は出ず、これが標準的な書き方です。",
        },
      ],
    },
    es: {
      name: "Simplificar fracciones",
      tagline:
        "Reduce cualquier fracción a sus términos mínimos mostrando el MCD, con el valor decimal y la forma de número mixto para las impropias.",
      intro: [
        "8/12 y 2/3 nombran la misma cantidad, pero solo 2/3 es la forma que esperan profesores, recetas y soluciones. Esta calculadora halla el máximo común divisor de numerador y denominador, divide ambos y muestra exactamente qué número hizo la cancelación. Si la fracción ya está en términos mínimos, lo dice en vez de fingir que simplificó algo.",
        "Las fracciones impropias vuelven con un extra: 14/6 se simplifica a 7/3 y se lee como el número mixto 2 1/3. El valor decimal va incluido para comprobar el tamaño de un vistazo — 0,333… es claramente un tercio.",
      ],
      steps: [
        "Introduzca el numerador y el denominador.",
        "Lea la fracción simplificada junto a su entrada.",
        "Consulte la línea del MCD para ver el número usado.",
        "Mire el decimal y el número mixto para captar el tamaño.",
      ],
      faqs: [
        {
          q: "¿Cómo encuentra la herramienta el MCD?",
          a: "Con el algoritmo de Euclides: divide el mayor por el menor, sustituye por el resto y repite hasta que el resto sea cero. Para 36 y 48 los restos van 36, 12, 0 — el MCD es 12 y 36/48 = 3/4.",
        },
        {
          q: "¿Para qué simplificar una fracción?",
          a: "Los términos mínimos son la convención común: soluciones, recetas escaladas y medidas citan 2/3, no 34/51. Las fracciones simplificadas también se comparan mejor: ver que 4/6 equivale a 2/3 cuesta un momento, pero 2/3 junto a 2/3 se reconoce al instante.",
        },
        {
          q: "¿Puede cambiar el valor al simplificar?",
          a: "Nunca. Dividir numerador y denominador entre el mismo número distinto de cero mantiene el valor idéntico; solo cambia la escritura. Con cero igual: 0/40 se simplifica a 0/1 y sigue siendo cero.",
        },
        {
          q: "¿Y las fracciones negativas?",
          a: "El signo acaba siempre en el numerador: −8/12 y 8/−12 se simplifican a −2/3. Un denominador negativo nunca se muestra, que es la forma escrita estándar.",
        },
      ],
    },
    pt: {
      name: "Simplificar frações",
      tagline: "Reduza qualquer fração aos menores termos mostrando o MDC — com o valor decimal e a forma de número misto para as impróprias.",
      intro: [
        "8/12 e 2/3 nomeiam a mesma quantidade, mas só 2/3 é a forma que professores, receitas e gabaritos esperam. Esta calculadora encontra o máximo divisor comum de numerador e denominador, divide os dois e mostra exatamente qual número fez o cancelamento. Se a fração já está irredutível, ela diz isso em vez de fingir que simplificou algo.",
        "Frações impróprias voltam com um bônus: 14/6 simplifica para 7/3 e se lê como o número misto 2 1/3. O valor decimal vem junto para conferir o tamanho de relance — 0,333… claramente é um terço.",
      ],
      steps: [
        "Informe o numerador e o denominador.",
        "Leia a fração simplificada ao lado da sua entrada.",
        "Veja a linha do MDC para saber o número usado.",
        "Observe o decimal e o número misto para sentir o tamanho.",
      ],
      faqs: [
        {
          q: "Como a ferramenta encontra o MDC?",
          a: "Pelo algoritmo de Euclides: divide o maior pelo menor, troca pelo resto e repete até o resto ser zero. Para 36 e 48 os restos vão 36, 12, 0 — o MDC é 12 e 36/48 = 3/4.",
        },
        {
          q: "Por que simplificar uma fração?",
          a: "Os menores termos são a convenção comum: gabaritos, receitas escaladas e medidas citam 2/3, não 34/51. Frações simplificadas também se comparam melhor: perceber que 4/6 vale 2/3 leva um instante, mas 2/3 ao lado de 2/3 é imediato.",
        },
        {
          q: "Simplificar pode mudar o valor?",
          a: "Nunca. Dividir numerador e denominador pelo mesmo número diferente de zero mantém o valor idêntico; muda só a escrita. Com zero também: 0/40 simplifica para 0/1 e continua zero.",
        },
        {
          q: "E frações negativas?",
          a: "O sinal sempre acaba no numerador: −8/12 e 8/−12 simplificam para −2/3. Denominador negativo nunca é exibido, que é a forma escrita padrão.",
        },
      ],
    },
  },
});
