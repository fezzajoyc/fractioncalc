import { MixedEngine } from "../_engines/engine-fraction-mixed";
import { defineTool } from "../_lib/types";

export default defineTool({
  slug: "fraction-mixed",
  category: "utility",
  icon: "layers",
  engine: { component: MixedEngine },
  related: ["fraction-add-subtract", "fraction-multiply-divide", "fraction-simplify", "fraction-decimal"],
  copy: {
    en: {
      name: "Mixed Number Calculator",
      tagline:
        "Convert mixed numbers to improper fractions and back, and add, subtract, multiply or divide mixed numbers with every step shown.",
      intro: [
        "Mixed numbers — 2 1/3, five and a half and their cousins — are how people actually say amounts out loud, but arithmetic rules are written for fractions. This tool bridges the two: type 2 1/3 and read 7/3, or type 7/3 and read 2 1/3, with the conversion rule (whole × denominator + numerator) spelled out.",
        "The arithmetic tab handles all four operations on mixed numbers. It converts each to an improper fraction, computes, and converts back — 1 1/2 + 2 1/3 lands on 23/6 and reads 3 5/6. Signs follow the written convention: −2 1/3 means −(2 + 1/3).",
      ],
      steps: [
        "Switch between Convert and Arithmetic.",
        "To convert, enter a mixed number or an improper fraction — the other form appears instantly.",
        "For arithmetic, enter two mixed numbers and choose +, −, × or ÷.",
        "Read the result as a mixed number, an improper fraction and a decimal, with the three steps below.",
      ],
      faqs: [
        {
          q: "How do I convert a mixed number to an improper fraction by hand?",
          a: "Multiply the whole part by the denominator, add the numerator, and keep the denominator: 2 1/3 → (2 × 3 + 1)/3 = 7/3. To go back, divide: 7 ÷ 3 gives quotient 2 and remainder 1, so 7/3 = 2 1/3.",
        },
        {
          q: "Why convert to improper fractions before computing?",
          a: "Because the fraction rules — common denominators for + and −, straight-across for × and ÷ — only work on plain fractions. 1 1/2 + 2 1/3 is awkward as written, but 3/2 + 7/3 = 9/6 + 14/6 = 23/6 = 3 5/6 follows the standard recipe.",
        },
        {
          q: "How does a negative mixed number work?",
          a: "By convention the minus covers everything: −2 1/3 = −(2 + 1/3) = −7/3. Enter the minus on the whole part and the tool applies it to the fraction too — no double-counting, no sign surprises.",
        },
        {
          q: "Can the whole part be zero?",
          a: "Yes — 0 3/4 is just 3/4, and results smaller than 1 drop the whole part automatically. A fractional part larger than the denominator is fine as well: 1 5/3 converts to 8/3 = 2 2/3.",
        },
      ],
    },
    zh: {
      name: "带分数计算器",
      tagline: "带分数与假分数双向换算,并支持带分数的加减乘除,每一步都展示出来。",
      intro: [
        "带分数——2 1/3、五又二分之一这类写法——是人们口头说数量的方式,但运算规则是为分数写的。这个工具在两者之间搭桥:输入 2 1/3 读出 7/3,或输入 7/3 读出 2 1/3,换算规则(整数 × 分母 + 分子)写得明明白白。",
        "运算页签支持带分数的四则运算:先把每个数化成假分数,再计算,最后化回——1 1/2 + 2 1/3 得 23/6,读作 3 5/6。符号遵循书写约定:−2 1/3 表示 −(2 + 1/3)。",
      ],
      steps: [
        "在“换算”和“运算”之间切换。",
        "换算:输入带分数或假分数,另一种形式立即出现。",
        "运算:输入两个带分数,选择 +、−、× 或 ÷。",
        "结果同时给出带分数、假分数和小数,下方附三个步骤。",
      ],
      faqs: [
        {
          q: "怎么手算把带分数化成假分数?",
          a: "整数部乘分母,加分子,分母不变:2 1/3 → (2 × 3 + 1)/3 = 7/3。反过来就做除法:7 ÷ 3 商 2 余 1,所以 7/3 = 2 1/3。",
        },
        {
          q: "为什么计算前要先化成假分数?",
          a: "因为分数法则——加减要通分,乘除直接乘——只对普通分数成立。1 1/2 + 2 1/3 直接看很别扭,但 3/2 + 7/3 = 9/6 + 14/6 = 23/6 = 3 5/6 就是标准流程。",
        },
        {
          q: "负带分数怎么算?",
          a: "按约定负号管住整体:−2 1/3 = −(2 + 1/3) = −7/3。在整数部输入负号,工具会把它同样作用到分数部——不会重复计号,也不会有符号意外。",
        },
        {
          q: "整数部可以是 0 吗?",
          a: "可以——0 3/4 就是 3/4,小于 1 的结果会自动省掉整数部。分数部大于分母也没关系:1 5/3 会换算成 8/3 = 2 2/3。",
        },
      ],
    },
    ja: {
      name: "帯分数計算",
      tagline: "帯分数と仮分数を双方向に変換し、帯分数の四則計算も過程つきで行います。",
      intro: [
        "帯分数——2 1/3 のような形——は人が量を口にするしかたですが、計算の規則は分数のために書かれています。このツールはその橋渡しをします。2 1/3 と入力すれば 7/3 と読め、7/3 と入力すれば 2 1/3 と読めます。変換の規則(整数 × 分母 + 分子)も明示します。",
        "計算タブは帯分数の四則に対応します。それぞれを仮分数に直して計算し、結果を帯分数に戻します。1 1/2 + 2 1/3 は 23/6 となり、3 5/6 と読めます。符号は書き方の規約に従い、−2 1/3 は −(2 + 1/3) を意味します。",
      ],
      steps: [
        "「変換」と「計算」を切り替えます。",
        "変換では帯分数か仮分数を入力します。もう一方の形がすぐ出ます。",
        "計算では帯分数を 2 つ入力し、+、−、×、÷ を選びます。",
        "結果は帯分数・仮分数・小数で表示され、3 つの過程が下に付きます。",
      ],
      faqs: [
        {
          q: "帯分数を仮分数にする手順は?",
          a: "整数部に分母をかけ、分子を足し、分母はそのまま。2 1/3 → (2 × 3 + 1)/3 = 7/3。逆にするには割り算をします。7 ÷ 3 は商 2 余り 1 なので、7/3 = 2 1/3。",
        },
        {
          q: "計算前に仮分数へ直すのはなぜ?",
          a: "分数の規則——+ と − には通分、× と ÷ にはそのままの掛け算——が素の分数にしか働かないからです。1 1/2 + 2 1/3 は書いたままでは扱いにくく、3/2 + 7/3 = 9/6 + 14/6 = 23/6 = 3 5/6 が標準の流れです。",
        },
        {
          q: "負の帯分数はどう扱う?",
          a: "規約ではマイナスが全体を包みます。−2 1/3 = −(2 + 1/3) = −7/3。整数部にマイナスを入れると、分数部にも同じ符号がかかります。符号の二重計上も、予想外の符号もありません。",
        },
        {
          q: "整数部は 0 でもいい?",
          a: "はい。0 3/4 はただの 3/4 で、1 未満の結果は整数部を自動的に省きます。分数部が分母より大きくても大丈夫です。1 5/3 は 8/3 = 2 2/3 に変わります。",
        },
      ],
    },
    es: {
      name: "Calculadora de números mixtos",
      tagline:
        "Convierte números mixtos a fracciones impropias y al revés, y suma, resta, multiplica o divide números mixtos con todos los pasos.",
      intro: [
        "Los números mixtos — 2 1/3, cinco y medio y sus primos — son como la gente dice las cantidades en voz alta, pero las reglas de operación están escritas para fracciones. Esta herramienta tiende el puente: escriba 2 1/3 y lea 7/3, o escriba 7/3 y lea 2 1/3, con la regla de conversión (entero × denominador + numerador) a la vista.",
        "La pestaña de operaciones cubre las cuatro operaciones con números mixtos: convierte cada uno a fracción impropia, calcula y vuelve a convertir — 1 1/2 + 2 1/3 cae en 23/6 y se lee 3 5/6. Los signos siguen la convención escrita: −2 1/3 significa −(2 + 1/3).",
      ],
      steps: [
        "Alterne entre Convertir y Operaciones.",
        "Para convertir, escriba un número mixto o una fracción impropia: la otra forma aparece al instante.",
        "Para operar, introduzca dos números mixtos y elija +, −, × o ÷.",
        "Lea el resultado como número mixto, fracción impropia y decimal, con los tres pasos debajo.",
      ],
      faqs: [
        {
          q: "¿Cómo se convierte un número mixto a impropia a mano?",
          a: "Multiplique la parte entera por el denominador, sume el numerador y conserve el denominador: 2 1/3 → (2 × 3 + 1)/3 = 7/3. Para volver, divida: 7 ÷ 3 da cociente 2 y resto 1, así que 7/3 = 2 1/3.",
        },
        {
          q: "¿Por qué convertir a impropias antes de operar?",
          a: "Porque las reglas de las fracciones — denominador común para + y −, en línea recta para × y ÷ — solo funcionan con fracciones simples. 1 1/2 + 2 1/3 es incómodo tal cual, pero 3/2 + 7/3 = 9/6 + 14/6 = 23/6 = 3 5/6 sigue la receta estándar.",
        },
        {
          q: "¿Cómo funciona un número mixto negativo?",
          a: "Por convención el menos cubre todo: −2 1/3 = −(2 + 1/3) = −7/3. Escriba el signo en la parte entera y la herramienta lo aplica también a la fracción: sin dobles conteos ni sorpresas de signo.",
        },
        {
          q: "¿Puede la parte entera ser cero?",
          a: "Sí: 0 3/4 es simplemente 3/4, y los resultados menores que 1 omiten la parte entera por su cuenta. También vale una parte fraccionaria mayor que el denominador: 1 5/3 se convierte en 8/3 = 2 2/3.",
        },
      ],
    },
    pt: {
      name: "Calculadora de números mistos",
      tagline:
        "Converta números mistos em frações impróprias e vice-versa, e some, subtraia, multiplique ou divida números mistos com todos os passos.",
      intro: [
        "Números mistos — 2 1/3, cinco e meio e parentes — são como as pessoas dizem quantidades em voz alta, mas as regras de operação foram escritas para frações. Esta ferramenta faz a ponte: digite 2 1/3 e leia 7/3, ou digite 7/3 e leia 2 1/3, com a regra de conversão (inteiro × denominador + numerador) explícita.",
        "A aba de operações cobre as quatro operações com números mistos: converte cada um em fração imprópria, calcula e converte de volta — 1 1/2 + 2 1/3 cai em 23/6 e lê-se 3 5/6. Os sinais seguem a convenção escrita: −2 1/3 significa −(2 + 1/3).",
      ],
      steps: [
        "Alterne entre Converter e Operações.",
        "Para converter, informe um número misto ou uma fração imprópria — a outra forma aparece na hora.",
        "Para operar, informe dois números mistos e escolha +, −, × ou ÷.",
        "Leia o resultado como número misto, fração imprópria e decimal, com os três passos abaixo.",
      ],
      faqs: [
        {
          q: "Como converter um número misto em imprópria no papel?",
          a: "Multiplique a parte inteira pelo denominador, some o numerador e mantenha o denominador: 2 1/3 → (2 × 3 + 1)/3 = 7/3. Para voltar, divida: 7 ÷ 3 dá quociente 2 e resto 1, então 7/3 = 2 1/3.",
        },
        {
          q: "Por que converter para impróprias antes de operar?",
          a: "Porque as regras das frações — denominador comum para + e −, em linha reta para × e ÷ — só valem para frações simples. 1 1/2 + 2 1/3 é esquisito do jeito que está, mas 3/2 + 7/3 = 9/6 + 14/6 = 23/6 = 3 5/6 segue a receita padrão.",
        },
        {
          q: "Como funciona um número misto negativo?",
          a: "Por convenção o menos cobre tudo: −2 1/3 = −(2 + 1/3) = −7/3. Digite o sinal na parte inteira e a ferramenta aplica à fração também — sem contagem dupla, sem surpresas de sinal.",
        },
        {
          q: "A parte inteira pode ser zero?",
          a: "Sim: 0 3/4 é simplesmente 3/4, e resultados menores que 1 dispensam a parte inteira por conta própria. Parte fracionária maior que o denominador também vale: 1 5/3 converte em 8/3 = 2 2/3.",
        },
      ],
    },
  },
});
