import { MulDivEngine } from "../_engines/engine-fraction-multiply-divide";
import { defineTool } from "../_lib/types";

export default defineTool({
  slug: "fraction-multiply-divide",
  category: "utility",
  icon: "shuffle",
  engine: { component: MulDivEngine },
  related: ["fraction-add-subtract", "fraction-simplify", "fraction-decimal", "fraction-mixed"],
  copy: {
    en: {
      name: "Multiply & Divide Fractions",
      tagline:
        "Multiply or divide two fractions with cross-simplification done first — the smallest numbers possible, a simplified result and every step written out.",
      intro: [
        "Multiplying fractions is the easy rule of fraction arithmetic — multiply straight across — and dividing only adds one twist: flip the second fraction. What most people get wrong is leaving the numbers huge: 8/12 × 9/15 computed naively is 72/180. This calculator cross-cancels first (down to 2/3 × 3/5), keeps the multiplication small, and the answer 2/5 appears with almost no simplifying left to do.",
        "For division, the tool rewrites the problem as multiplication by the reciprocal — 3/4 ÷ 2/5 becomes 3/4 × 5/2 — and shows the flip explicitly as the first step. Division by zero is refused outright, since no number times 0 ever gives 3/4.",
      ],
      steps: [
        "Enter the numerator and denominator of the first fraction.",
        "Choose multiply (×) or divide (÷), then enter the second fraction.",
        "Read the simplified result with its mixed-number and decimal forms.",
        "Check the steps: cross-simplification, the multiplication itself, and the final reduction.",
      ],
      faqs: [
        {
          q: "Why flip the second fraction when dividing?",
          a: "Dividing asks how many times the divisor fits into the dividend, and that is answered by multiplying by the reciprocal: 3/4 ÷ 2/5 = 3/4 × 5/2 = 15/8 = 1 7/8. The calculator performs the flip for you and shows it as the first step.",
        },
        {
          q: "What is cross-simplification?",
          a: "Before multiplying, each numerator is cancelled against the other denominator by their GCD. For 2/4 × 3/6, the 2 and the 6 share the factor 2, so the numerator becomes 1 and the second denominator becomes 3. Nothing else cancels, and 1/4 × 3/3 = 3/12 = 1/4.",
        },
        {
          q: "Do I need a common denominator to multiply?",
          a: "No — that is only for adding and subtracting. Multiplication works straight across the bars, and rewriting as equivalent fractions is never needed.",
        },
        {
          q: "What happens with negative or improper fractions?",
          a: "They behave normally: signs follow the usual minus-times-minus rule, so 1/2 × (−2/3) = −1/3. Improper results are converted to mixed numbers, for example 5/3 × 4/3 = 20/9 = 2 2/9.",
        },
      ],
    },
    zh: {
      name: "分数乘除法计算器",
      tagline: "两个分数相乘或相除,先交叉约分再计算,数字最小、结果最简,每一步都写清楚。",
      intro: [
        "分数乘法是分数运算里最简单的规则——分子乘分子、分母乘分母;除法只多一步:把第二个分数颠倒过来。多数人容易犯的错是让数字变大:8/12 × 9/15 直接算是 72/180。本计算器先交叉约分(约成 2/3 × 3/5),乘法数字更小,答案 2/5 几乎不用再约分。",
        "做除法时,工具会把它改写成乘倒数——3/4 ÷ 2/5 变成 3/4 × 5/2——并明确展示这个颠倒作为第一步。除以 0 会被直接拒绝,因为没有任何数乘以 0 能得到 3/4。",
      ],
      steps: [
        "输入第一个分数的分子和分母。",
        "选择乘(×)或除(÷),再输入第二个分数。",
        "查看化简后的结果及其带分数、小数形式。",
        "核对步骤:交叉约分、相乘、最后约分。",
      ],
      faqs: [
        {
          q: "为什么除法要把第二个分数颠倒?",
          a: "除法问的是除数能装进被除数几次,答案就是把除数取倒数再相乘:3/4 ÷ 2/5 = 3/4 × 5/2 = 15/8 = 1 7/8。计算器会替你完成颠倒,并把它作为第一步展示。",
        },
        {
          q: "什么是交叉约分?",
          a: "相乘之前,每个分子先和对方的分母约去最大公约数。以 2/4 × 3/6 为例:2 和 6 有公因数 2,分子变 1、第二个分母变 3;其余无可约,1/4 × 3/3 = 3/12 = 1/4。",
        },
        {
          q: "乘法需要通分吗?",
          a: "不需要——通分只用于加减。乘法直接分子乘分子、分母乘分母,完全不用化等价分数。",
        },
        {
          q: "负分数和假分数怎么处理?",
          a: "一切照常:符号遵循负负得正,如 1/2 × (−2/3) = −1/3。结果是假分数时会化成带分数,如 5/3 × 4/3 = 20/9 = 2 2/9。",
        },
      ],
    },
    ja: {
      name: "分数のかけ算・わり算",
      tagline:
        "2 つの分数の乗除を、たすき掛けの約分から先に自動処理。数字を最小に保ち、結果は既約分数・帯分数・小数で、過程もすべて表示します。",
      intro: [
        "分数のかけ算は分数計算の中でいちばん単純で、分子どうし・分母どうしをかけるだけ。わり算ももう一段増えるだけです。2 番目の分数をひっくり返す。多くの人が間違えるのは数字を大きくしたまま計算することで、8/12 × 9/15 をそのまま計算すると 72/180 になります。この計算機は先にたすき掛けで約分し(2/3 × 3/5 まで)、かけ算の数字を小さく保つので、答え 2/5 はほとんど約分なしで出ます。",
        "わり算では、問題を逆数をかける形に書き換えてから計算します。3/4 ÷ 2/5 は 3/4 × 5/2 になり、ひっくり返した過程も最初のステップとして明示します。0 でわる入力は、どんな数も 0 をかけて 3/4 にはならないため、その場で拒否します。",
      ],
      steps: [
        "1 番目の分数の分子と分母を入力します。",
        "かけ算(×)かわり算(÷)を選び、2 番目の分数を入力します。",
        "既約の結果と、帯分数・小数の形を確認します。",
        "過程を確認します。たすき掛けの約分 → かけ算 → 最後の約分。",
      ],
      faqs: [
        {
          q: "わり算で 2 番目の分数をひっくり返すのはなぜ?",
          a: "わり算は「わる数が何回入るか」を問うていて、それは逆数をかけることと同じです。3/4 ÷ 2/5 = 3/4 × 5/2 = 15/8 = 1 7/8。計算機がひっくり返しを行い、最初の過程として表示します。",
        },
        {
          q: "たすき掛けの約分とは?",
          a: "かける前に、各分子を相手の分母と最大公約数で約分します。2/4 × 3/6 なら 2 と 6 が公約数 2 を持つので、分子は 1、相手の分母は 3 に。ほかに約分できるところはなく、1/4 × 3/3 = 3/12 = 1/4 です。",
        },
        {
          q: "かけ算に通分は要りますか?",
          a: "いりません。通分は足し算と引き算だけの話です。かけ算は分子どうし・分母どうしをそのままかければよく、同値な分数への書き換えは不要です。",
        },
        {
          q: "負の分数や仮分数はどう扱われますか?",
          a: "ふつう通りです。符号はマイナス × マイナス = プラスの規則に従い、1/2 × (−2/3) = −1/3。結果が仮分数なら帯分数も出します。5/3 × 4/3 = 20/9 = 2 2/9。",
        },
      ],
    },
    es: {
      name: "Multiplicar y dividir fracciones",
      tagline:
        "Multiplica o divide dos fracciones simplificando en cruz primero: los números más pequeños posibles, resultado simplificado y cada paso por escrito.",
      intro: [
        "Multiplicar fracciones es la regla fácil — todo en línea recta — y dividir solo añade un giro: dar la vuelta a la segunda fracción. Lo que suele salir mal es dejar los números enormes: 8/12 × 9/15 calculado a lo bruto da 72/180. Esta calculadora simplifica en cruz primero (hasta 2/3 × 3/5), mantiene la multiplicación pequeña y la respuesta 2/5 aparece casi sin simplificar.",
        "Para dividir, la herramienta reescribe el problema como multiplicación por el recíproco — 3/4 ÷ 2/5 pasa a 3/4 × 5/2 — y muestra el giro de forma explícita como primer paso. Dividir entre cero se rechaza de plano: ningún número por 0 da 3/4.",
      ],
      steps: [
        "Introduzca el numerador y el denominador de la primera fracción.",
        "Elija multiplicar (×) o dividir (÷) e introduzca la segunda fracción.",
        "Lea el resultado simplificado con sus formas de número mixto y decimal.",
        "Revise los pasos: simplificación en cruz, la multiplicación y la reducción final.",
      ],
      faqs: [
        {
          q: "¿Por qué se invierte la segunda fracción al dividir?",
          a: "Dividir pregunta cuántas veces cabe el divisor, y eso se responde multiplicando por el recíproco: 3/4 ÷ 2/5 = 3/4 × 5/2 = 15/8 = 1 7/8. La calculadora hace la inversión y la muestra como primer paso.",
        },
        {
          q: "¿Qué es simplificar en cruz?",
          a: "Antes de multiplicar, cada numerador se cancela con el denominador contrario según su MCD. Para 2/4 × 3/6, el 2 y el 6 comparten el factor 2: el numerador queda 1 y el segundo denominador 3. Nada más se cancela y 1/4 × 3/3 = 3/12 = 1/4.",
        },
        {
          q: "¿Hace falta denominador común para multiplicar?",
          a: "No — eso es solo para sumar y restar. La multiplicación va en línea recta; nunca hace falta reescribir como fracciones equivalentes.",
        },
        {
          q: "¿Y con fracciones negativas o impropias?",
          a: "Se comportan con normalidad: los signos siguen la regla de menos por menos, así que 1/2 × (−2/3) = −1/3. Los resultados impropios se convierten a números mixtos: 5/3 × 4/3 = 20/9 = 2 2/9.",
        },
      ],
    },
    pt: {
      name: "Multiplicar e dividir frações",
      tagline:
        "Multiplique ou divida duas frações simplificando em cruz primeiro — os menores números possíveis, resultado irredutível e cada passo por escrito.",
      intro: [
        "Multiplicar frações é a regra fácil — tudo em linha reta — e dividir só acrescenta um detalhe: virar a segunda fração. O que costuma dar errado é deixar os números enormes: 8/12 × 9/15 calculado de qualquer jeito dá 72/180. Esta calculadora simplifica em cruz primeiro (até 2/3 × 3/5), mantém a multiplicação pequena e a resposta 2/5 aparece quase sem simplificar.",
        "Para dividir, a ferramenta reescreve o problema como multiplicação pelo recíproco — 3/4 ÷ 2/5 vira 3/4 × 5/2 — e mostra a virada de forma explícita como primeiro passo. Divisão por zero é recusada de imediato: nenhum número vezes 0 dá 3/4.",
      ],
      steps: [
        "Digite o numerador e o denominador da primeira fração.",
        "Escolha multiplicar (×) ou dividir (÷) e informe a segunda fração.",
        "Leia o resultado irredutível com as formas de número misto e decimal.",
        "Confira os passos: simplificação em cruz, a multiplicação e a redução final.",
      ],
      faqs: [
        {
          q: "Por que virar a segunda fração ao dividir?",
          a: "Dividir pergunta quantas vezes o divisor cabe, e isso se responde multiplicando pelo recíproco: 3/4 ÷ 2/5 = 3/4 × 5/2 = 15/8 = 1 7/8. A calculadora faz a virada e mostra como primeiro passo.",
        },
        {
          q: "O que é simplificar em cruz?",
          a: "Antes de multiplicar, cada numerador se cancela com o denominador oposto pelo MDC. Em 2/4 × 3/6, o 2 e o 6 dividem o fator 2: o numerador vira 1 e o segundo denominador vira 3. Nada mais se cancela e 1/4 × 3/3 = 3/12 = 1/4.",
        },
        {
          q: "É preciso denominador comum para multiplicar?",
          a: "Não — isso é só para somar e subtrair. A multiplicação vai em linha reta; nunca é preciso reescrever como frações equivalentes.",
        },
        {
          q: "E com frações negativas ou impróprias?",
          a: "Funcionam normalmente: os sinais seguem a regra de menos com menos, então 1/2 × (−2/3) = −1/3. Resultados impróprios viram números mistos: 5/3 × 4/3 = 20/9 = 2 2/9.",
        },
      ],
    },
  },
});
