(function () {
  "use strict";

  const C = 299792458;
  const T0 = 290;
  const UK_GALLON_L = 4.54609;
  const US_GALLON_L = 3.785411784;

  const positive = (value, label = "Value") => {
    if (!(value > 0)) throw new Error(label + " must be greater than zero.");
    return value;
  };

  const finite = (value, label = "Value") => {
    if (!Number.isFinite(value)) throw new Error(label + " is not a valid number.");
    return value;
  };

  const parseNumeric = (raw) => {
    let text = String(raw ?? "").trim().replace(/\s+/g, "");
    if (!text) throw new Error("Enter a value.");
    if (/^[+-]?\d+,\d+$/.test(text) && !text.includes(".")) text = text.replace(",", ".");
    else text = text.replace(/,/g, "");
    return finite(Number(text));
  };

  const formatNumber = (value) => {
    if (typeof value === "bigint") return value.toString();
    if (typeof value === "string") return value;
    finite(value, "Result");
    if (Object.is(value, -0)) value = 0;
    const abs = Math.abs(value);
    if (abs !== 0 && (abs >= 1e10 || abs < 1e-7)) {
      return value.toExponential(7).replace(/\.?0+e/, "e");
    }
    return new Intl.NumberFormat(undefined, {
      maximumSignificantDigits: 10,
      useGrouping: false
    }).format(value);
  };

  const unit = (id, label, symbol, toBase, fromBase, options = {}) => ({
    id,
    label,
    symbol,
    aliases: options.aliases || [],
    inputMode: options.inputMode || "decimal",
    toBase,
    fromBase
  });

  const lin = (id, label, symbol, factor, aliases = []) =>
    unit(id, label, symbol, (v) => parseNumeric(v) * factor, (v) => v / factor, { aliases });

  const aff = (id, label, symbol, factor, offset, aliases = []) =>
    unit(id, label, symbol, (v) => parseNumeric(v) * factor + offset, (v) => (v - offset) / factor, { aliases });

  const custom = (id, label, symbol, toBase, fromBase, options = {}) =>
    unit(id, label, symbol, toBase, fromBase, options);

  const family = (id, title, category, units, options = {}) => ({
    id,
    title,
    category,
    units,
    keywords: options.keywords || [],
    note: options.note || "",
    format: options.format || formatNumber
  });

  const families = [];

  // GENERAL
  families.push(family("length", "Length", "General", [
    lin("pm", "picometre", "pm", 1e-12),
    lin("nm", "nanometre", "nm", 1e-9),
    lin("um", "micrometre", "µm", 1e-6, ["micron"]),
    lin("mm", "millimetre", "mm", 1e-3),
    lin("cm", "centimetre", "cm", 1e-2),
    lin("m", "metre", "m", 1),
    lin("km", "kilometre", "km", 1e3),
    lin("mil", "thousandth of an inch", "mil", 0.0000254),
    lin("in", "inch", "in", 0.0254),
    lin("ft", "foot", "ft", 0.3048),
    lin("yd", "yard", "yd", 0.9144),
    lin("mi", "mile", "mi", 1609.344),
    lin("nmi", "nautical mile", "nmi", 1852),
    lin("angstrom", "ångström", "Å", 1e-10)
  ], { keywords: ["distance", "height", "width", "imperial", "metric"] }));

  families.push(family("area", "Area", "General", [
    lin("mm2", "square millimetre", "mm²", 1e-6),
    lin("cm2", "square centimetre", "cm²", 1e-4),
    lin("m2", "square metre", "m²", 1),
    lin("km2", "square kilometre", "km²", 1e6),
    lin("in2", "square inch", "in²", 0.00064516),
    lin("ft2", "square foot", "ft²", 0.09290304),
    lin("yd2", "square yard", "yd²", 0.83612736),
    lin("acre", "acre", "acre", 4046.8564224),
    lin("ha", "hectare", "ha", 10000)
  ]));

  families.push(family("volume", "Volume", "General", [
    lin("ul", "microlitre", "µL", 1e-9),
    lin("ml", "millilitre", "mL", 1e-6),
    lin("cl", "centilitre", "cL", 1e-5),
    lin("l", "litre", "L", 1e-3),
    lin("m3", "cubic metre", "m³", 1),
    lin("in3", "cubic inch", "in³", 0.000016387064),
    lin("ft3", "cubic foot", "ft³", 0.028316846592),
    lin("yd3", "cubic yard", "yd³", 0.764554857984),
    lin("ukfloz", "UK fluid ounce", "fl oz UK", UK_GALLON_L / 160000),
    lin("usfloz", "US fluid ounce", "fl oz US", US_GALLON_L / 128000),
    lin("ukpt", "UK pint", "pt UK", UK_GALLON_L / 8000),
    lin("uspt", "US pint", "pt US", US_GALLON_L / 8000),
    lin("ukgal", "UK gallon", "gal UK", UK_GALLON_L / 1000),
    lin("usgal", "US gallon", "gal US", US_GALLON_L / 1000),
    lin("bbl", "oil barrel", "bbl", 0.158987294928)
  ]));

  families.push(family("mass", "Mass", "General", [
    lin("ug", "microgram", "µg", 1e-9),
    lin("mg", "milligram", "mg", 1e-6),
    lin("g", "gram", "g", 1e-3),
    lin("kg", "kilogram", "kg", 1),
    lin("t", "tonne", "t", 1000),
    lin("oz", "ounce", "oz", 0.028349523125),
    lin("lb", "pound", "lb", 0.45359237),
    lin("st", "stone", "st", 6.35029318),
    lin("shortton", "US short ton", "short ton", 907.18474),
    lin("longton", "UK long ton", "long ton", 1016.0469088)
  ], { keywords: ["weight"] }));

  families.push(family("temperature", "Temperature", "General", [
    aff("c", "Celsius", "°C", 1, 273.15),
    aff("f", "Fahrenheit", "°F", 5 / 9, 255.3722222222222),
    aff("k", "kelvin", "K", 1, 0),
    aff("r", "Rankine", "°R", 5 / 9, 0)
  ]));

  families.push(family("time", "Time", "General", [
    lin("ns", "nanosecond", "ns", 1e-9),
    lin("us", "microsecond", "µs", 1e-6),
    lin("ms", "millisecond", "ms", 1e-3),
    lin("s", "second", "s", 1),
    lin("min", "minute", "min", 60),
    lin("h", "hour", "h", 3600),
    lin("day", "day", "day", 86400),
    lin("week", "week", "week", 604800),
    lin("year", "Julian year", "year", 31557600)
  ]));

  families.push(family("speed", "Speed", "General", [
    lin("mps", "metres per second", "m/s", 1),
    lin("kmh", "kilometres per hour", "km/h", 1 / 3.6),
    lin("mph", "miles per hour", "mph", 0.44704),
    lin("knot", "knot", "kn", 0.5144444444444445),
    lin("fps", "feet per second", "ft/s", 0.3048)
  ]));

  families.push(family("acceleration", "Acceleration", "General", [
    lin("mps2", "metres per second squared", "m/s²", 1),
    lin("g", "standard gravity", "g", 9.80665),
    lin("gal", "gal", "Gal", 0.01),
    lin("fps2", "feet per second squared", "ft/s²", 0.3048)
  ]));

  families.push(family("angle", "Angle", "General", [
    lin("rad", "radian", "rad", 1),
    lin("deg", "degree", "°", Math.PI / 180),
    lin("grad", "gradian", "gon", Math.PI / 200),
    lin("turn", "turn", "turn", 2 * Math.PI),
    lin("mil", "NATO mil", "mil", 2 * Math.PI / 6400)
  ]));

  families.push(family("force", "Force", "General", [
    lin("un", "micronewton", "µN", 1e-6),
    lin("mn", "millinewton", "mN", 1e-3),
    lin("n", "newton", "N", 1),
    lin("kn", "kilonewton", "kN", 1e3),
    lin("mn_big", "meganewton", "MN", 1e6),
    lin("lbf", "pound-force", "lbf", 4.4482216152605),
    lin("kgf", "kilogram-force", "kgf", 9.80665),
    lin("dyn", "dyne", "dyn", 1e-5)
  ]));

  families.push(family("torque", "Torque", "General", [
    lin("mnm", "millinewton metre", "mN·m", 1e-3),
    lin("nm", "newton metre", "N·m", 1),
    lin("knm", "kilonewton metre", "kN·m", 1e3),
    lin("lbfin", "pound-force inch", "lbf·in", 0.1129848290276167),
    lin("lbfft", "pound-force foot", "lbf·ft", 1.3558179483314),
    lin("kgfcm", "kilogram-force centimetre", "kgf·cm", 0.0980665)
  ]));

  families.push(family("pressure", "Pressure", "General", [
    lin("pa", "pascal", "Pa", 1),
    lin("hpa", "hectopascal", "hPa", 100),
    lin("kpa", "kilopascal", "kPa", 1000),
    lin("mpa", "megapascal", "MPa", 1e6),
    lin("bar", "bar", "bar", 1e5),
    lin("mbar", "millibar", "mbar", 100),
    lin("atm", "standard atmosphere", "atm", 101325),
    lin("psi", "pounds per square inch", "psi", 6894.757293168),
    lin("ksi", "kilopounds per square inch", "ksi", 6894757.293168),
    lin("torr", "torr", "Torr", 133.32236842105263),
    lin("mmhg", "millimetre of mercury", "mmHg", 133.322387415),
    lin("inhg", "inch of mercury", "inHg", 3386.388640341),
    lin("mmh2o", "millimetre of water", "mmH₂O", 9.80665),
    lin("inh2o", "inch of water", "inH₂O", 249.08891)
  ]));

  families.push(family("energy", "Energy", "General", [
    lin("nj", "nanojoule", "nJ", 1e-9),
    lin("uj", "microjoule", "µJ", 1e-6),
    lin("mj", "millijoule", "mJ", 1e-3),
    lin("j", "joule", "J", 1),
    lin("kj", "kilojoule", "kJ", 1e3),
    lin("mj_big", "megajoule", "MJ", 1e6),
    lin("wh", "watt-hour", "Wh", 3600),
    lin("kwh", "kilowatt-hour", "kWh", 3.6e6),
    lin("mwh", "megawatt-hour", "MWh", 3.6e9),
    lin("cal", "calorie", "cal", 4.184),
    lin("kcal", "kilocalorie", "kcal", 4184),
    lin("btu", "British thermal unit", "BTU", 1055.05585262),
    lin("ftlb", "foot-pound force", "ft·lbf", 1.3558179483314),
    lin("ev", "electronvolt", "eV", 1.602176634e-19)
  ]));

  families.push(family("power", "Power", "General", [
    lin("pw", "picowatt", "pW", 1e-12),
    lin("nw", "nanowatt", "nW", 1e-9),
    lin("uw", "microwatt", "µW", 1e-6),
    lin("mw", "milliwatt", "mW", 1e-3),
    lin("w", "watt", "W", 1),
    lin("kw", "kilowatt", "kW", 1e3),
    lin("mw_big", "megawatt", "MW", 1e6),
    lin("gw", "gigawatt", "GW", 1e9),
    lin("hp", "mechanical horsepower", "hp", 745.6998715822702),
    lin("hp_metric", "metric horsepower", "PS", 735.49875),
    lin("btuh", "BTU per hour", "BTU/h", 0.2930710701722222),
    lin("tonref", "ton of refrigeration", "TR", 3516.8528420667)
  ]));

  families.push(family("density", "Density", "General", [
    lin("kgm3", "kilogram per cubic metre", "kg/m³", 1),
    lin("gcm3", "gram per cubic centimetre", "g/cm³", 1000),
    lin("gml", "gram per millilitre", "g/mL", 1000),
    lin("kgl", "kilogram per litre", "kg/L", 1000),
    lin("lbft3", "pound per cubic foot", "lb/ft³", 16.01846337396),
    lin("lbusgal", "pound per US gallon", "lb/gal US", 119.826427316),
    lin("lbukgal", "pound per UK gallon", "lb/gal UK", 99.776372663)
  ]));

  families.push(family("volume-flow", "Volumetric flow", "General", [
    lin("lps", "litre per second", "L/s", 1e-3),
    lin("lpm", "litre per minute", "L/min", 1e-3 / 60),
    lin("lph", "litre per hour", "L/h", 1e-3 / 3600),
    lin("m3s", "cubic metre per second", "m³/s", 1),
    lin("m3min", "cubic metre per minute", "m³/min", 1 / 60),
    lin("m3h", "cubic metre per hour", "m³/h", 1 / 3600),
    lin("cfm", "cubic foot per minute", "cfm", 0.028316846592 / 60),
    lin("usgpm", "US gallon per minute", "gpm US", (US_GALLON_L / 1000) / 60),
    lin("ukgpm", "UK gallon per minute", "gpm UK", (UK_GALLON_L / 1000) / 60)
  ], { keywords: ["flow rate"] }));

  families.push(family("mass-flow", "Mass flow", "General", [
    lin("gps", "gram per second", "g/s", 1e-3),
    lin("kgps", "kilogram per second", "kg/s", 1),
    lin("kgpm", "kilogram per minute", "kg/min", 1 / 60),
    lin("kgph", "kilogram per hour", "kg/h", 1 / 3600),
    lin("tph", "tonne per hour", "t/h", 1000 / 3600),
    lin("lbps", "pound per second", "lb/s", 0.45359237),
    lin("lbpm", "pound per minute", "lb/min", 0.45359237 / 60),
    lin("lbph", "pound per hour", "lb/h", 0.45359237 / 3600)
  ]));

  families.push(family("fuel-economy", "Fuel economy", "General", [
    custom("l100km", "litres per 100 km", "L/100 km",
      (v) => positive(parseNumeric(v)),
      (v) => v),
    custom("kml", "kilometres per litre", "km/L",
      (v) => 100 / positive(parseNumeric(v)),
      (v) => 100 / positive(v)),
    custom("mpguk", "miles per UK gallon", "mpg UK",
      (v) => 282.480936331822 / positive(parseNumeric(v)),
      (v) => 282.480936331822 / positive(v)),
    custom("mpgus", "miles per US gallon", "mpg US",
      (v) => 235.214583 / positive(parseNumeric(v)),
      (v) => 235.214583 / positive(v))
  ]));

  families.push(family("dynamic-viscosity", "Dynamic viscosity", "General", [
    lin("pas", "pascal-second", "Pa·s", 1),
    lin("mpas", "millipascal-second", "mPa·s", 1e-3),
    lin("cp", "centipoise", "cP", 1e-3),
    lin("p", "poise", "P", 0.1),
    lin("lbfts", "pound per foot-second", "lb/(ft·s)", 1.48816394357)
  ]));

  families.push(family("kinematic-viscosity", "Kinematic viscosity", "General", [
    lin("m2s", "square metre per second", "m²/s", 1),
    lin("mm2s", "square millimetre per second", "mm²/s", 1e-6),
    lin("cst", "centistokes", "cSt", 1e-6),
    lin("st", "stokes", "St", 1e-4),
    lin("ft2s", "square foot per second", "ft²/s", 0.09290304)
  ]));

  families.push(family("frequency", "Frequency", "General", [
    lin("nhz", "nanohertz", "nHz", 1e-9),
    lin("uhz", "microhertz", "µHz", 1e-6),
    lin("mhz_small", "millihertz", "mHz", 1e-3),
    lin("hz", "hertz", "Hz", 1),
    lin("khz", "kilohertz", "kHz", 1e3),
    lin("mhz", "megahertz", "MHz", 1e6),
    lin("ghz", "gigahertz", "GHz", 1e9),
    lin("thz", "terahertz", "THz", 1e12),
    lin("rpm", "revolutions per minute", "rpm", 1 / 60)
  ]));

  families.push(family("frequency-period", "Frequency and period", "General", [
    custom("hz", "hertz", "Hz",
      (v) => positive(parseNumeric(v)),
      (v) => v),
    custom("khz", "kilohertz", "kHz",
      (v) => positive(parseNumeric(v)) * 1e3,
      (v) => v / 1e3),
    custom("mhz", "megahertz", "MHz",
      (v) => positive(parseNumeric(v)) * 1e6,
      (v) => v / 1e6),
    custom("ghz", "gigahertz", "GHz",
      (v) => positive(parseNumeric(v)) * 1e9,
      (v) => v / 1e9),
    custom("s", "period in seconds", "s",
      (v) => 1 / positive(parseNumeric(v)),
      (v) => 1 / positive(v)),
    custom("ms", "period in milliseconds", "ms",
      (v) => 1 / (positive(parseNumeric(v)) * 1e-3),
      (v) => (1 / positive(v)) / 1e-3),
    custom("us", "period in microseconds", "µs",
      (v) => 1 / (positive(parseNumeric(v)) * 1e-6),
      (v) => (1 / positive(v)) / 1e-6),
    custom("ns", "period in nanoseconds", "ns",
      (v) => 1 / (positive(parseNumeric(v)) * 1e-9),
      (v) => (1 / positive(v)) / 1e-9)
  ]));

  families.push(family("angular-speed", "Angular speed", "General", [
    lin("rads", "radians per second", "rad/s", 1),
    lin("degs", "degrees per second", "°/s", Math.PI / 180),
    lin("rps", "revolutions per second", "r/s", 2 * Math.PI),
    lin("rpm", "revolutions per minute", "rpm", 2 * Math.PI / 60)
  ]));

  families.push(family("illuminance", "Illuminance", "General", [
    lin("lux", "lux", "lx", 1),
    lin("klux", "kilolux", "klx", 1000),
    lin("fc", "foot-candle", "fc", 10.76391041671),
    lin("phot", "phot", "ph", 10000)
  ]));

  families.push(family("luminance", "Luminance", "General", [
    lin("cdm2", "candela per square metre", "cd/m²", 1),
    lin("nit", "nit", "nt", 1),
    lin("fl", "foot-lambert", "fL", 3.4262590996),
    lin("asb", "apostilb", "asb", 1 / Math.PI)
  ]));

  families.push(family("radioactivity", "Radioactivity", "General", [
    lin("bq", "becquerel", "Bq", 1),
    lin("kbq", "kilobecquerel", "kBq", 1e3),
    lin("mbq", "megabecquerel", "MBq", 1e6),
    lin("gbq", "gigabecquerel", "GBq", 1e9),
    lin("ci", "curie", "Ci", 3.7e10),
    lin("mci", "millicurie", "mCi", 3.7e7),
    lin("uci", "microcurie", "µCi", 3.7e4)
  ]));

  families.push(family("absorbed-dose", "Absorbed dose", "General", [
    lin("gy", "gray", "Gy", 1),
    lin("mgy", "milligray", "mGy", 1e-3),
    lin("ugy", "microgray", "µGy", 1e-6),
    lin("rad", "rad", "rad", 0.01)
  ]));

  families.push(family("dose-equivalent", "Dose equivalent", "General", [
    lin("sv", "sievert", "Sv", 1),
    lin("msv", "millisievert", "mSv", 1e-3),
    lin("usv", "microsievert", "µSv", 1e-6),
    lin("rem", "rem", "rem", 0.01),
    lin("mrem", "millirem", "mrem", 1e-5)
  ]));

  families.push(family("concentration", "Concentration ratio", "General", [
    lin("fraction", "fraction", "ratio", 1),
    lin("percent", "percent", "%", 0.01),
    lin("permille", "per mille", "‰", 0.001),
    lin("ppm", "parts per million", "ppm", 1e-6),
    lin("ppb", "parts per billion", "ppb", 1e-9),
    lin("ppt", "parts per trillion", "ppt", 1e-12)
  ]));

  families.push(family("sound-pressure", "Sound pressure", "General", [
    lin("pa", "pascal RMS", "Pa", 1),
    lin("mpa", "millipascal RMS", "mPa", 1e-3),
    lin("upa", "micropascal RMS", "µPa", 1e-6),
    custom("dbspl", "sound pressure level", "dB SPL",
      (v) => 20e-6 * Math.pow(10, parseNumeric(v) / 20),
      (v) => 20 * Math.log10(positive(v) / 20e-6))
  ], { note: "dB SPL uses the standard 20 µPa RMS reference." }));

  families.push(family("slope", "Slope and gradient", "General", [
    custom("ratio", "rise/run ratio", "ratio",
      (v) => parseNumeric(v),
      (v) => v),
    custom("percent", "percent grade", "%",
      (v) => parseNumeric(v) / 100,
      (v) => v * 100),
    custom("degrees", "slope angle", "°",
      (v) => Math.tan(parseNumeric(v) * Math.PI / 180),
      (v) => Math.atan(v) * 180 / Math.PI),
    custom("radians", "slope angle", "rad",
      (v) => Math.tan(parseNumeric(v)),
      (v) => Math.atan(v))
  ]));

  families.push(family("metric-prefix", "Metric prefixes", "General", [
    lin("p", "pico", "p", 1e-12),
    lin("n", "nano", "n", 1e-9),
    lin("u", "micro", "µ", 1e-6),
    lin("m", "milli", "m", 1e-3),
    lin("base", "base unit", "unit", 1),
    lin("k", "kilo", "k", 1e3),
    lin("M", "mega", "M", 1e6),
    lin("G", "giga", "G", 1e9),
    lin("T", "tera", "T", 1e12)
  ]));

  const gcd = (a, b) => {
    a = Math.abs(a); b = Math.abs(b);
    while (b) [a, b] = [b, a % b];
    return a;
  };

  const parseFraction = (raw) => {
    const text = String(raw ?? "").trim();
    if (/^[+-]?\d+\s+\d+\/\d+$/.test(text)) {
      const [whole, frac] = text.split(/\s+/);
      const [n, d] = frac.split("/").map(Number);
      if (!d) throw new Error("Fraction denominator cannot be zero.");
      return Number(whole) + Math.sign(Number(whole) || 1) * n / d;
    }
    if (/^[+-]?\d+\/\d+$/.test(text)) {
      const [n, d] = text.split("/").map(Number);
      if (!d) throw new Error("Fraction denominator cannot be zero.");
      return n / d;
    }
    return parseNumeric(text);
  };

  const toFraction = (value) => {
    finite(value);
    const sign = value < 0 ? "-" : "";
    value = Math.abs(value);
    const tolerance = 1e-9;
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = value;
    for (let i = 0; i < 32; i += 1) {
      const a = Math.floor(b);
      const h = a * h1 + h2;
      const k = a * k1 + k2;
      if (Math.abs(value - h / k) < tolerance || k > 100000) {
        const whole = Math.floor(h / k);
        const remainder = h % k;
        if (!remainder) return sign + String(whole);
        if (whole) return sign + whole + " " + remainder + "/" + k;
        return sign + h + "/" + k;
      }
      h2 = h1; h1 = h; k2 = k1; k1 = k;
      b = 1 / (b - a);
    }
    return formatNumber(sign === "-" ? -value : value);
  };

  families.push(family("fraction", "Decimal and fraction", "General", [
    custom("decimal", "decimal", "decimal",
      (v) => parseNumeric(v),
      (v) => v),
    custom("fraction", "fraction", "fraction",
      (v) => parseFraction(v),
      (v) => toFraction(v),
      { inputMode: "text" })
  ], { format: (value) => typeof value === "string" ? value : formatNumber(value) }));

  // RF AND SIGNAL
  families.push(family("rf-power", "RF power level", "RF & Signal", [
    lin("pw", "picowatt", "pW", 1e-12),
    lin("nw", "nanowatt", "nW", 1e-9),
    lin("uw", "microwatt", "µW", 1e-6),
    lin("mw", "milliwatt", "mW", 1e-3),
    lin("w", "watt", "W", 1),
    lin("kw", "kilowatt", "kW", 1e3),
    custom("dbm", "dBm", "dBm",
      (v) => 1e-3 * Math.pow(10, parseNumeric(v) / 10),
      (v) => 10 * Math.log10(positive(v) / 1e-3)),
    custom("dbw", "dBW", "dBW",
      (v) => Math.pow(10, parseNumeric(v) / 10),
      (v) => 10 * Math.log10(positive(v)))
  ], { keywords: ["watts", "dbm", "dbw", "transmitter", "signal"] }));

  families.push(family("rf-psd", "RF spectral power density", "RF & Signal", [
    lin("whz", "watt per hertz", "W/Hz", 1),
    lin("mwhz", "milliwatt per hertz", "mW/Hz", 1e-3),
    lin("uwhz", "microwatt per hertz", "µW/Hz", 1e-6),
    custom("dbmhz", "dBm per hertz", "dBm/Hz",
      (v) => 1e-3 * Math.pow(10, parseNumeric(v) / 10),
      (v) => 10 * Math.log10(positive(v) / 1e-3)),
    custom("dbwhz", "dBW per hertz", "dBW/Hz",
      (v) => Math.pow(10, parseNumeric(v) / 10),
      (v) => 10 * Math.log10(positive(v)))
  ]));

  families.push(family("power-ratio", "Power ratio and dB", "RF & Signal", [
    custom("ratio", "power ratio", "ratio", (v) => positive(parseNumeric(v)), (v) => v),
    custom("percent", "power percentage", "%", (v) => positive(parseNumeric(v)) / 100, (v) => v * 100),
    custom("db", "power gain/loss", "dB", (v) => Math.pow(10, parseNumeric(v) / 10), (v) => 10 * Math.log10(positive(v))),
    custom("np", "power nepers", "Np", (v) => Math.exp(2 * parseNumeric(v)), (v) => 0.5 * Math.log(positive(v)))
  ], { note: "This converts ratios only. Applying dB gain or loss to a starting wattage is a calculator." }));

  families.push(family("voltage-ratio", "Voltage ratio and dB", "RF & Signal", [
    custom("ratio", "voltage ratio", "ratio", (v) => positive(parseNumeric(v)), (v) => v),
    custom("percent", "voltage percentage", "%", (v) => positive(parseNumeric(v)) / 100, (v) => v * 100),
    custom("db", "voltage gain/loss", "dB", (v) => Math.pow(10, parseNumeric(v) / 20), (v) => 20 * Math.log10(positive(v))),
    custom("np", "voltage nepers", "Np", (v) => Math.exp(parseNumeric(v)), (v) => Math.log(positive(v)))
  ]));

  families.push(family("antenna-gain", "Antenna gain", "RF & Signal", [
    custom("linear", "linear power gain", "×", (v) => positive(parseNumeric(v)), (v) => v),
    custom("dbi", "gain relative to isotropic", "dBi", (v) => Math.pow(10, parseNumeric(v) / 10), (v) => 10 * Math.log10(positive(v))),
    custom("dbd", "gain relative to dipole", "dBd", (v) => Math.pow(10, (parseNumeric(v) + 2.15) / 10), (v) => 10 * Math.log10(positive(v)) - 2.15)
  ]));

  families.push(family("return-loss", "VSWR, return loss and reflection", "RF & Signal", [
    custom("gamma", "reflection coefficient magnitude", "|Γ|",
      (v) => {
        const x = parseNumeric(v);
        if (x < 0 || x >= 1) throw new Error("|Γ| must be between 0 and 1.");
        return x;
      },
      (v) => v),
    custom("percent", "reflected voltage", "%",
      (v) => {
        const x = parseNumeric(v) / 100;
        if (x < 0 || x >= 1) throw new Error("Reflection must be below 100%.");
        return x;
      },
      (v) => v * 100),
    custom("vswr", "VSWR", "VSWR",
      (v) => {
        const x = parseNumeric(v);
        if (x < 1) throw new Error("VSWR must be at least 1.");
        return (x - 1) / (x + 1);
      },
      (v) => (1 + v) / (1 - v)),
    custom("rl", "return loss", "dB",
      (v) => Math.pow(10, -parseNumeric(v) / 20),
      (v) => v === 0 ? Infinity : -20 * Math.log10(positive(v))),
    custom("ml", "mismatch loss", "dB",
      (v) => Math.sqrt(Math.max(0, 1 - Math.pow(10, -parseNumeric(v) / 10))),
      (v) => -10 * Math.log10(Math.max(Number.MIN_VALUE, 1 - v * v)))
  ]));

  families.push(family("noise", "Noise figure and temperature", "RF & Signal", [
    custom("factor", "noise factor", "F", (v) => positive(parseNumeric(v)), (v) => v),
    custom("nf", "noise figure", "dB", (v) => Math.pow(10, parseNumeric(v) / 10), (v) => 10 * Math.log10(positive(v))),
    custom("temp", "equivalent noise temperature", "K", (v) => parseNumeric(v) / T0 + 1, (v) => (v - 1) * T0)
  ], { note: "Equivalent noise temperature uses the conventional 290 K reference." }));

  families.push(family("electric-field", "Electric field strength", "RF & Signal", [
    lin("vpm", "volt per metre", "V/m", 1),
    lin("mvpm", "millivolt per metre", "mV/m", 1e-3),
    lin("uvpm", "microvolt per metre", "µV/m", 1e-6),
    custom("dbvpm", "dB volt per metre", "dBV/m", (v) => Math.pow(10, parseNumeric(v) / 20), (v) => 20 * Math.log10(positive(v))),
    custom("dbmvpm", "dB millivolt per metre", "dBmV/m", (v) => 1e-3 * Math.pow(10, parseNumeric(v) / 20), (v) => 20 * Math.log10(positive(v) / 1e-3)),
    custom("dbuvpm", "dB microvolt per metre", "dBµV/m", (v) => 1e-6 * Math.pow(10, parseNumeric(v) / 20), (v) => 20 * Math.log10(positive(v) / 1e-6))
  ]));

  families.push(family("magnetic-field", "Magnetic field strength", "RF & Signal", [
    lin("apm", "ampere per metre", "A/m", 1),
    lin("mapm", "milliampere per metre", "mA/m", 1e-3),
    lin("uapm", "microampere per metre", "µA/m", 1e-6),
    custom("dbapm", "dB ampere per metre", "dBA/m", (v) => Math.pow(10, parseNumeric(v) / 20), (v) => 20 * Math.log10(positive(v))),
    custom("dbmapm", "dB milliampere per metre", "dBmA/m", (v) => 1e-3 * Math.pow(10, parseNumeric(v) / 20), (v) => 20 * Math.log10(positive(v) / 1e-3)),
    custom("dbuapm", "dB microampere per metre", "dBµA/m", (v) => 1e-6 * Math.pow(10, parseNumeric(v) / 20), (v) => 20 * Math.log10(positive(v) / 1e-6))
  ]));

  const rfVoltageFamily = (id, title, impedance) => family(id, title, "RF & Signal", [
    lin("v", "volt RMS", "V RMS", 1),
    lin("mv", "millivolt RMS", "mV RMS", 1e-3),
    lin("uv", "microvolt RMS", "µV RMS", 1e-6),
    lin("nv", "nanovolt RMS", "nV RMS", 1e-9),
    custom("dbv", "dBV", "dBV", (v) => Math.pow(10, parseNumeric(v) / 20), (v) => 20 * Math.log10(positive(v))),
    custom("dbmv", "dBmV", "dBmV", (v) => 1e-3 * Math.pow(10, parseNumeric(v) / 20), (v) => 20 * Math.log10(positive(v) / 1e-3)),
    custom("dbuv", "dBµV", "dBµV", (v) => 1e-6 * Math.pow(10, parseNumeric(v) / 20), (v) => 20 * Math.log10(positive(v) / 1e-6)),
    custom("w", "watt", "W", (v) => Math.sqrt(positive(parseNumeric(v)) * impedance), (v) => v * v / impedance),
    custom("mw", "milliwatt", "mW", (v) => Math.sqrt(positive(parseNumeric(v)) * 1e-3 * impedance), (v) => (v * v / impedance) / 1e-3),
    custom("dbm", "dBm", "dBm", (v) => Math.sqrt(1e-3 * Math.pow(10, parseNumeric(v) / 10) * impedance), (v) => 10 * Math.log10((positive(v) * v / impedance) / 1e-3)),
    custom("dbw", "dBW", "dBW", (v) => Math.sqrt(Math.pow(10, parseNumeric(v) / 10) * impedance), (v) => 10 * Math.log10(positive(v) * v / impedance))
  ], { note: "Assumes a purely resistive " + impedance + " Ω system and RMS voltage." });

  families.push(rfVoltageFamily("rf-voltage-50", "RF level at 50 Ω", 50));
  families.push(rfVoltageFamily("rf-voltage-75", "RF level at 75 Ω", 75));

  families.push(family("erp-eirp", "ERP and EIRP", "RF & Signal", [
    lin("eirpw", "EIRP watt", "W EIRP", 1),
    lin("eirpkw", "EIRP kilowatt", "kW EIRP", 1000),
    custom("eirpdbm", "EIRP dBm", "dBm EIRP", (v) => 1e-3 * Math.pow(10, parseNumeric(v) / 10), (v) => 10 * Math.log10(positive(v) / 1e-3)),
    custom("eirpdbw", "EIRP dBW", "dBW EIRP", (v) => Math.pow(10, parseNumeric(v) / 10), (v) => 10 * Math.log10(positive(v))),
    lin("erpw", "ERP watt", "W ERP", 1.64),
    lin("erpkw", "ERP kilowatt", "kW ERP", 1640),
    custom("erpdbm", "ERP dBm", "dBm ERP", (v) => 1.64e-3 * Math.pow(10, parseNumeric(v) / 10), (v) => 10 * Math.log10(positive(v) / 1.64e-3)),
    custom("erpdbw", "ERP dBW", "dBW ERP", (v) => 1.64 * Math.pow(10, parseNumeric(v) / 10), (v) => 10 * Math.log10(positive(v) / 1.64))
  ], { note: "Uses the conventional EIRP = 1.64 × ERP relationship (2.15 dB)." }));

  families.push(family("frequency-wavelength", "Frequency and free-space wavelength", "RF & Signal", [
    custom("hz", "hertz", "Hz", (v) => positive(parseNumeric(v)), (v) => v),
    custom("khz", "kilohertz", "kHz", (v) => positive(parseNumeric(v)) * 1e3, (v) => v / 1e3),
    custom("mhz", "megahertz", "MHz", (v) => positive(parseNumeric(v)) * 1e6, (v) => v / 1e6),
    custom("ghz", "gigahertz", "GHz", (v) => positive(parseNumeric(v)) * 1e9, (v) => v / 1e9),
    custom("thz", "terahertz", "THz", (v) => positive(parseNumeric(v)) * 1e12, (v) => v / 1e12),
    custom("m", "wavelength metres", "m", (v) => C / positive(parseNumeric(v)), (v) => C / positive(v)),
    custom("cm", "wavelength centimetres", "cm", (v) => C / (positive(parseNumeric(v)) * 1e-2), (v) => (C / positive(v)) / 1e-2),
    custom("mm", "wavelength millimetres", "mm", (v) => C / (positive(parseNumeric(v)) * 1e-3), (v) => (C / positive(v)) / 1e-3),
    custom("um", "wavelength micrometres", "µm", (v) => C / (positive(parseNumeric(v)) * 1e-6), (v) => (C / positive(v)) / 1e-6)
  ], { note: "Uses the speed of light in vacuum. Cable velocity factor belongs in the cable-delay calculator." }));

  // ELECTRICAL
  families.push(family("voltage", "Voltage", "Electrical", [
    lin("nv", "nanovolt", "nV", 1e-9),
    lin("uv", "microvolt", "µV", 1e-6),
    lin("mv", "millivolt", "mV", 1e-3),
    lin("v", "volt", "V", 1),
    lin("kv", "kilovolt", "kV", 1e3),
    lin("mv_big", "megavolt", "MV", 1e6)
  ]));

  families.push(family("current", "Current", "Electrical", [
    lin("pa", "picoampere", "pA", 1e-12),
    lin("na", "nanoampere", "nA", 1e-9),
    lin("ua", "microampere", "µA", 1e-6),
    lin("ma", "milliampere", "mA", 1e-3),
    lin("a", "ampere", "A", 1),
    lin("ka", "kiloampere", "kA", 1e3)
  ]));

  families.push(family("resistance", "Resistance", "Electrical", [
    lin("uohm", "microohm", "µΩ", 1e-6),
    lin("mohm", "milliohm", "mΩ", 1e-3),
    lin("ohm", "ohm", "Ω", 1),
    lin("kohm", "kilohm", "kΩ", 1e3),
    lin("Mohm", "megohm", "MΩ", 1e6),
    lin("Gohm", "gigohm", "GΩ", 1e9)
  ]));

  families.push(family("conductance", "Conductance", "Electrical", [
    lin("ns", "nanosiemens", "nS", 1e-9),
    lin("us", "microsiemens", "µS", 1e-6),
    lin("ms", "millisiemens", "mS", 1e-3),
    lin("s", "siemens", "S", 1),
    lin("ks", "kilosiemens", "kS", 1e3)
  ]));

  families.push(family("capacitance", "Capacitance", "Electrical", [
    lin("ff", "femtofarad", "fF", 1e-15),
    lin("pf", "picofarad", "pF", 1e-12),
    lin("nf", "nanofarad", "nF", 1e-9),
    lin("uf", "microfarad", "µF", 1e-6),
    lin("mf", "millifarad", "mF", 1e-3),
    lin("f", "farad", "F", 1)
  ]));

  families.push(family("inductance", "Inductance", "Electrical", [
    lin("nh", "nanohenry", "nH", 1e-9),
    lin("uh", "microhenry", "µH", 1e-6),
    lin("mh", "millihenry", "mH", 1e-3),
    lin("h", "henry", "H", 1)
  ]));

  families.push(family("charge", "Electric charge", "Electrical", [
    lin("pc", "picocoulomb", "pC", 1e-12),
    lin("nc", "nanocoulomb", "nC", 1e-9),
    lin("uc", "microcoulomb", "µC", 1e-6),
    lin("mc", "millicoulomb", "mC", 1e-3),
    lin("c", "coulomb", "C", 1),
    lin("mah", "milliamp-hour", "mAh", 3.6),
    lin("ah", "amp-hour", "Ah", 3600)
  ]));

  families.push(family("magnetic-flux", "Magnetic flux", "Electrical", [
    lin("nwb", "nanoweber", "nWb", 1e-9),
    lin("uwb", "microweber", "µWb", 1e-6),
    lin("mwb", "milliweber", "mWb", 1e-3),
    lin("wb", "weber", "Wb", 1),
    lin("mx", "maxwell", "Mx", 1e-8)
  ]));

  families.push(family("flux-density", "Magnetic flux density", "Electrical", [
    lin("nt", "nanotesla", "nT", 1e-9),
    lin("ut", "microtesla", "µT", 1e-6),
    lin("mt", "millitesla", "mT", 1e-3),
    lin("t", "tesla", "T", 1),
    lin("g", "gauss", "G", 1e-4)
  ]));

  families.push(family("conductivity", "Electrical conductivity", "Electrical", [
    lin("sm", "siemens per metre", "S/m", 1),
    lin("msm", "millisiemens per metre", "mS/m", 1e-3),
    lin("uscm", "microsiemens per centimetre", "µS/cm", 1e-4),
    lin("mscm", "millisiemens per centimetre", "mS/cm", 0.1)
  ]));

  families.push(family("resistivity", "Electrical resistivity", "Electrical", [
    lin("ohmm", "ohm metre", "Ω·m", 1),
    lin("ohmcm", "ohm centimetre", "Ω·cm", 0.01),
    lin("mohmm", "milliohm metre", "mΩ·m", 1e-3),
    lin("uohmm", "microohm metre", "µΩ·m", 1e-6),
    lin("uohmcm", "microohm centimetre", "µΩ·cm", 1e-8)
  ]));

  families.push(family("apparent-power", "Apparent power", "Electrical", [
    lin("va", "volt-ampere", "VA", 1),
    lin("kva", "kilovolt-ampere", "kVA", 1e3),
    lin("mva", "megavolt-ampere", "MVA", 1e6)
  ]));

  families.push(family("reactive-power", "Reactive power", "Electrical", [
    lin("var", "volt-ampere reactive", "var", 1),
    lin("kvar", "kilovar", "kvar", 1e3),
    lin("mvar", "megavar", "Mvar", 1e6)
  ]));

  const awgToMm = (awg) => 0.127 * Math.pow(92, (36 - awg) / 39);
  const mmToAwg = (mm) => 36 - 39 * Math.log(mm / 0.127) / Math.log(92);

  families.push(family("wire-size", "Wire size", "Electrical", [
    custom("awg", "American wire gauge", "AWG",
      (v) => {
        const awg = parseNumeric(v);
        const d = awgToMm(awg);
        return Math.PI * d * d / 4;
      },
      (area) => mmToAwg(Math.sqrt(4 * positive(area) / Math.PI))),
    custom("diameter-mm", "conductor diameter", "mm",
      (v) => {
        const d = positive(parseNumeric(v));
        return Math.PI * d * d / 4;
      },
      (area) => Math.sqrt(4 * positive(area) / Math.PI)),
    custom("diameter-in", "conductor diameter", "in",
      (v) => {
        const d = positive(parseNumeric(v)) * 25.4;
        return Math.PI * d * d / 4;
      },
      (area) => Math.sqrt(4 * positive(area) / Math.PI) / 25.4),
    custom("area-mm2", "cross-sectional area", "mm²",
      (v) => positive(parseNumeric(v)),
      (v) => v),
    custom("cmil", "circular mil area", "cmil",
      (v) => positive(parseNumeric(v)) * 0.0005067074790974977,
      (v) => v / 0.0005067074790974977)
  ], { note: "AWG values are calculated from the standard solid-wire diameter formula." }));

  // BROADCAST
  families.push(family("dtt-channel", "UK DTT UHF channel", "Broadcast", [
    custom("channel", "UHF channel number", "Ch",
      (v) => {
        const ch = parseNumeric(v);
        if (ch < 21 || ch > 69) throw new Error("Use a UHF channel from 21 to 69.");
        return 474 + 8 * (ch - 21);
      },
      (mhz) => 21 + (mhz - 474) / 8),
    custom("mhz", "centre frequency", "MHz",
      (v) => parseNumeric(v),
      (v) => v)
  ], { note: "Uses the UK 8 MHz UHF raster. Current assignments may use a smaller subset of channels." }));

  const dabBlocks = {
    "5A": 174.928, "5B": 176.640, "5C": 178.352, "5D": 180.064,
    "6A": 181.936, "6B": 183.648, "6C": 185.360, "6D": 187.072,
    "7A": 188.928, "7B": 190.640, "7C": 192.352, "7D": 194.064,
    "8A": 195.936, "8B": 197.648, "8C": 199.360, "8D": 201.072,
    "9A": 202.928, "9B": 204.640, "9C": 206.352, "9D": 208.064,
    "10A": 209.936, "10N": 210.096, "10B": 211.648, "10C": 213.360, "10D": 215.072,
    "11A": 216.928, "11N": 217.088, "11B": 218.640, "11C": 220.352, "11D": 222.064,
    "12A": 223.936, "12N": 224.096, "12B": 225.648, "12C": 227.360, "12D": 229.072,
    "13A": 230.784, "13B": 232.496, "13C": 234.208, "13D": 235.776,
    "13E": 237.488, "13F": 239.200
  };
  const nearestDabBlock = (mhz) => Object.entries(dabBlocks).sort((a, b) => Math.abs(a[1] - mhz) - Math.abs(b[1] - mhz))[0][0];

  families.push(family("dab-block", "DAB block and frequency", "Broadcast", [
    custom("block", "DAB block", "Block",
      (v) => {
        const key = String(v ?? "").trim().toUpperCase();
        if (!(key in dabBlocks)) throw new Error("Enter a valid DAB Band III block, for example 12B.");
        return dabBlocks[key];
      },
      (mhz) => nearestDabBlock(mhz),
      { inputMode: "text" }),
    custom("mhz", "centre frequency", "MHz",
      (v) => parseNumeric(v),
      (v) => v)
  ], {
    format: (value) => typeof value === "string" ? value : formatNumber(value),
    note: "Frequency-to-block returns the nearest Band III DAB block."
  }));

  families.push(family("fm-raster", "FM 100 kHz raster", "Broadcast", [
    custom("index", "100 kHz step from 87.5 MHz", "step",
      (v) => 87.5 + parseNumeric(v) * 0.1,
      (mhz) => (mhz - 87.5) / 0.1),
    custom("mhz", "FM frequency", "MHz",
      (v) => parseNumeric(v),
      (v) => v)
  ], { note: "Step 0 is 87.5 MHz; each step is 100 kHz." }));

  // PROCESS AND SENSORS
  const processFamily = (id, title, category, low, high, unitLabel, symbol) => family(id, title, category, [
    custom("percent", "engineering percentage", "%",
      (v) => parseNumeric(v),
      (v) => v),
    custom("signal", unitLabel, symbol,
      (v) => (parseNumeric(v) - low) * 100 / (high - low),
      (v) => low + v * (high - low) / 100)
  ], { note: "This converts the raw signal to 0–100%. A custom engineering range belongs in the scaling calculator." });

  families.push(processFamily("process-4-20ma", "4–20 mA and percent", "Process & Sensors", 4, 20, "loop current", "mA"));
  families.push(processFamily("process-0-20ma", "0–20 mA and percent", "Process & Sensors", 0, 20, "loop current", "mA"));
  families.push(processFamily("process-0-10v", "0–10 V and percent", "Process & Sensors", 0, 10, "signal voltage", "V"));
  families.push(processFamily("process-2-10v", "2–10 V and percent", "Process & Sensors", 2, 10, "signal voltage", "V"));
  families.push(processFamily("process-1-5v", "1–5 V and percent", "Process & Sensors", 1, 5, "signal voltage", "V"));
  families.push(processFamily("process-0-5v", "0–5 V and percent", "Process & Sensors", 0, 5, "signal voltage", "V"));

  const rtdResistance = (temperature, r0) => {
    const t = temperature;
    const A = 3.9083e-3;
    const B = -5.775e-7;
    const Ccoef = -4.183e-12;
    if (t >= 0) return r0 * (1 + A * t + B * t * t);
    return r0 * (1 + A * t + B * t * t + Ccoef * (t - 100) * t * t * t);
  };

  const rtdTemperature = (resistance, r0) => {
    const r = positive(resistance);
    let low = -200, high = 850;
    for (let i = 0; i < 80; i += 1) {
      const mid = (low + high) / 2;
      if (rtdResistance(mid, r0) < r) low = mid;
      else high = mid;
    }
    return (low + high) / 2;
  };

  const rtdFamily = (id, title, r0) => family(id, title, "Process & Sensors", [
    custom("c", "temperature", "°C",
      (v) => parseNumeric(v),
      (v) => v),
    custom("f", "temperature", "°F",
      (v) => (parseNumeric(v) - 32) * 5 / 9,
      (v) => v * 9 / 5 + 32),
    custom("ohm", "sensor resistance", "Ω",
      (v) => rtdTemperature(parseNumeric(v), r0),
      (v) => rtdResistance(v, r0))
  ], { note: "Uses IEC 60751 Callendar–Van Dusen coefficients over the standard RTD range." });

  families.push(rtdFamily("pt100", "PT100 resistance and temperature", 100));
  families.push(rtdFamily("pt1000", "PT1000 resistance and temperature", 1000));

  // DIGITAL
  families.push(family("data-storage", "Data storage", "Digital", [
    lin("bit", "bit", "bit", 1 / 8),
    lin("nibble", "nibble", "nibble", 0.5),
    lin("byte", "byte", "B", 1),
    lin("kb", "kilobyte", "kB", 1e3),
    lin("mb", "megabyte", "MB", 1e6),
    lin("gb", "gigabyte", "GB", 1e9),
    lin("tb", "terabyte", "TB", 1e12),
    lin("kib", "kibibyte", "KiB", 1024),
    lin("mib", "mebibyte", "MiB", 1048576),
    lin("gib", "gibibyte", "GiB", 1073741824),
    lin("tib", "tebibyte", "TiB", 1099511627776)
  ]));

  families.push(family("data-rate", "Data rate", "Digital", [
    lin("bps", "bit per second", "bit/s", 1),
    lin("kbps", "kilobit per second", "kbit/s", 1e3),
    lin("mbps", "megabit per second", "Mbit/s", 1e6),
    lin("gbps", "gigabit per second", "Gbit/s", 1e9),
    lin("tbps", "terabit per second", "Tbit/s", 1e12),
    lin("Bs", "byte per second", "B/s", 8),
    lin("kBs", "kilobyte per second", "kB/s", 8e3),
    lin("MBs", "megabyte per second", "MB/s", 8e6),
    lin("GBs", "gigabyte per second", "GB/s", 8e9),
    lin("KiBs", "kibibyte per second", "KiB/s", 8192),
    lin("MiBs", "mebibyte per second", "MiB/s", 8388608)
  ]));

  const parseBase = (raw, radix) => {
    const text = String(raw ?? "").trim().replace(/[_\s]/g, "");
    if (!text) throw new Error("Enter a value.");
    const sign = text.startsWith("-") ? -1n : 1n;
    const body = text.replace(/^[+-]/, "").replace(/^0[bxo]/i, "");
    if (!body) throw new Error("Enter a value.");
    const patterns = {
      2: /^[01]+$/i,
      8: /^[0-7]+$/i,
      10: /^\d+$/i,
      16: /^[0-9a-f]+$/i
    };
    if (!patterns[radix].test(body)) throw new Error("Value is not valid for base " + radix + ".");
    let result = 0n;
    for (const ch of body.toLowerCase()) {
      const digit = BigInt(parseInt(ch, 16));
      result = result * BigInt(radix) + digit;
    }
    return result * sign;
  };

  families.push(family("number-base", "Number bases", "Digital", [
    custom("bin", "binary", "base 2", (v) => parseBase(v, 2), (v) => v.toString(2), { inputMode: "text" }),
    custom("oct", "octal", "base 8", (v) => parseBase(v, 8), (v) => v.toString(8), { inputMode: "text" }),
    custom("dec", "decimal integer", "base 10", (v) => parseBase(v, 10), (v) => v.toString(10), { inputMode: "text" }),
    custom("hex", "hexadecimal", "base 16", (v) => parseBase(v, 16), (v) => v.toString(16).toUpperCase(), { inputMode: "text" })
  ], { format: (value) => String(value), note: "Integer conversion supports large values using BigInt." }));

  families.push(family("baud-period", "Baud rate and symbol period", "Digital", [
    custom("baud", "baud", "Bd", (v) => positive(parseNumeric(v)), (v) => v),
    custom("kbaud", "kilobaud", "kBd", (v) => positive(parseNumeric(v)) * 1e3, (v) => v / 1e3),
    custom("mbaud", "megabaud", "MBd", (v) => positive(parseNumeric(v)) * 1e6, (v) => v / 1e6),
    custom("s", "symbol period seconds", "s", (v) => 1 / positive(parseNumeric(v)), (v) => 1 / positive(v)),
    custom("ms", "symbol period milliseconds", "ms", (v) => 1 / (positive(parseNumeric(v)) * 1e-3), (v) => (1 / positive(v)) / 1e-3),
    custom("us", "symbol period microseconds", "µs", (v) => 1 / (positive(parseNumeric(v)) * 1e-6), (v) => (1 / positive(v)) / 1e-6),
    custom("ns", "symbol period nanoseconds", "ns", (v) => 1 / (positive(parseNumeric(v)) * 1e-9), (v) => (1 / positive(v)) / 1e-9)
  ]));

  families.push(family("unix-time", "Unix timestamp and date", "Digital", [
    custom("seconds", "Unix seconds", "s since epoch",
      (v) => parseNumeric(v) * 1000,
      (v) => v / 1000),
    custom("milliseconds", "Unix milliseconds", "ms since epoch",
      (v) => parseNumeric(v),
      (v) => v),
    custom("iso", "ISO date and time", "ISO 8601",
      (v) => {
        const t = Date.parse(String(v ?? "").trim());
        if (!Number.isFinite(t)) throw new Error("Enter a valid ISO date/time.");
        return t;
      },
      (v) => new Date(v).toISOString(),
      { inputMode: "text" })
  ], { format: (value) => typeof value === "string" ? value : formatNumber(value) }));

  const parseDms = (raw) => {
    const text = String(raw ?? "").trim().toUpperCase();
    const sign = /[SW-]/.test(text) ? -1 : 1;
    const nums = text.match(/\d+(?:\.\d+)?/g);
    if (!nums || !nums.length) throw new Error("Enter decimal degrees or DMS.");
    const deg = Number(nums[0]);
    const min = Number(nums[1] || 0);
    const sec = Number(nums[2] || 0);
    return sign * (deg + min / 60 + sec / 3600);
  };

  const toDms = (value) => {
    const sign = value < 0 ? "-" : "";
    const abs = Math.abs(value);
    const deg = Math.floor(abs);
    const minFloat = (abs - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = (minFloat - min) * 60;
    return sign + deg + "° " + min + "′ " + formatNumber(sec) + "″";
  };

  families.push(family("coordinates", "Coordinate angle formats", "Digital", [
    custom("decimal", "decimal degrees", "DD",
      (v) => parseNumeric(v),
      (v) => v),
    custom("dms", "degrees minutes seconds", "DMS",
      (v) => parseDms(v),
      (v) => toDms(v),
      { inputMode: "text" }),
    custom("radians", "radians", "rad",
      (v) => parseNumeric(v) * 180 / Math.PI,
      (v) => v * Math.PI / 180)
  ], { format: (value) => typeof value === "string" ? value : formatNumber(value), note: "Convert one latitude or longitude coordinate at a time." }));

  const byId = Object.fromEntries(families.map((entry) => [entry.id, entry]));
  const categories = [...new Set(families.map((entry) => entry.category))];

  const familyText = (entry) => [
    entry.title,
    entry.category,
    ...(entry.keywords || []),
    ...entry.units.flatMap((u) => [u.label, u.symbol, ...(u.aliases || [])])
  ].join(" ").toLowerCase();

  const optionLabel = (entry, u) => entry.title + " — " + u.label + (u.symbol ? " (" + u.symbol + ")" : "");

  const getUnit = (familyId, unitId) => {
    const entry = byId[familyId];
    if (!entry) throw new Error("Unknown conversion family.");
    const u = entry.units.find((candidate) => candidate.id === unitId);
    if (!u) throw new Error("Unknown unit.");
    return { family: entry, unit: u };
  };

  const convert = (familyId, fromUnitId, toUnitId, rawValue) => {
    const from = getUnit(familyId, fromUnitId);
    const to = getUnit(familyId, toUnitId);
    const base = from.unit.toBase(rawValue);
    const result = to.unit.fromBase(base);
    return {
      family: from.family,
      from: from.unit,
      to: to.unit,
      raw: result,
      formatted: from.family.format(result)
    };
  };

  const listSourceOptions = (query = "", category = "All") => {
    const q = String(query || "").trim().toLowerCase();
    return families
      .filter((entry) => (category === "All" || entry.category === category) && (!q || familyText(entry).includes(q)))
      .flatMap((entry) => entry.units.map((u) => ({
        value: entry.id + "::" + u.id,
        familyId: entry.id,
        unitId: u.id,
        label: optionLabel(entry, u),
        group: entry.title
      })));
  };

  const readStored = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  };

  const writeStored = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { /* Storage may be unavailable. */ }
  };

  const splitValue = (value) => {
    const [familyId, unitId] = String(value || "").split("::");
    return { familyId, unitId };
  };

  const populateSource = (select, query, category, preferred) => {
    const options = listSourceOptions(query, category);
    select.innerHTML = "";
    const groups = new Map();
    options.forEach((entry) => {
      if (!groups.has(entry.group)) {
        const optgroup = document.createElement("optgroup");
        optgroup.label = entry.group;
        groups.set(entry.group, optgroup);
        select.appendChild(optgroup);
      }
      const option = document.createElement("option");
      option.value = entry.value;
      option.textContent = entry.label.replace(entry.group + " — ", "");
      groups.get(entry.group).appendChild(option);
    });
    if (!options.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No matching conversions";
      select.appendChild(option);
      select.disabled = true;
      return null;
    }
    select.disabled = false;
    if (preferred && options.some((entry) => entry.value === preferred)) select.value = preferred;
    else select.value = options[0].value;
    return splitValue(select.value);
  };

  const populateTargets = (select, familyId, preferredUnitId) => {
    const entry = byId[familyId];
    select.innerHTML = "";
    entry.units.forEach((u) => {
      const option = document.createElement("option");
      option.value = u.id;
      option.textContent = u.label + (u.symbol ? " (" + u.symbol + ")" : "");
      select.appendChild(option);
    });
    if (preferredUnitId && entry.units.some((u) => u.id === preferredUnitId)) {
      select.value = preferredUnitId;
    } else {
      select.selectedIndex = Math.min(1, entry.units.length - 1);
    }
  };

  const mount = (root, config = {}) => {
    if (!root) return null;
    const filter = root.querySelector("[data-converter-filter]");
    const category = root.querySelector("[data-converter-category]");
    const fromSelect = root.querySelector("[data-converter-from-unit]");
    const toSelect = root.querySelector("[data-converter-to-unit]");
    const fromInput = root.querySelector("[data-converter-from-value]");
    const toInput = root.querySelector("[data-converter-to-value]");
    const swap = root.querySelector("[data-converter-swap]");
    const familyLabel = root.querySelector("[data-converter-family]");
    const note = root.querySelector("[data-converter-note]");
    const count = root.querySelector("[data-converter-count]");
    const copy = root.querySelector("[data-converter-copy]");
    const clear = root.querySelector("[data-converter-clear]");
    const recent = root.querySelector("[data-converter-recent]");
    const error = root.querySelector("[data-converter-error]");
    const key = config.storageKey || "fieldOpsAtlas.converter.v1";
    const recentKey = key + ".recent";
    const state = readStored(key, {});
    let lastResult = "";

    if (category) {
      category.innerHTML = "";
      ["All", ...categories].forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        category.appendChild(option);
      });
      category.value = state.category && ["All", ...categories].includes(state.category) ? state.category : "All";
    }

    if (count) {
      const unitCount = families.reduce((sum, entry) => sum + entry.units.length, 0);
      count.textContent = families.length + " families · " + unitCount + " units";
    }

    const saveState = () => {
      const from = splitValue(fromSelect.value);
      writeStored(key, {
        filter: filter ? filter.value : "",
        category: category ? category.value : "All",
        from: fromSelect.value,
        to: toSelect.value,
        value: fromInput.value
      });
    };

    const addRecent = () => {
      if (!fromSelect.value || !toSelect.value || !fromInput.value.trim() || !lastResult) return;
      const from = splitValue(fromSelect.value);
      const entry = {
        familyId: from.familyId,
        fromUnitId: from.unitId,
        toUnitId: toSelect.value,
        value: fromInput.value,
        result: lastResult,
        usedAt: new Date().toISOString()
      };
      const items = readStored(recentKey, []).filter((item) =>
        !(item.familyId === entry.familyId && item.fromUnitId === entry.fromUnitId && item.toUnitId === entry.toUnitId)
      );
      items.unshift(entry);
      writeStored(recentKey, items.slice(0, 8));
      renderRecent();
    };

    const renderRecent = () => {
      if (!recent) return;
      const items = readStored(recentKey, []);
      recent.innerHTML = "";
      if (!items.length) {
        recent.textContent = "No recent conversion pairs yet.";
        return;
      }
      items.slice(0, 5).forEach((item) => {
        const entry = byId[item.familyId];
        if (!entry) return;
        const fromUnit = entry.units.find((u) => u.id === item.fromUnitId);
        const toUnit = entry.units.find((u) => u.id === item.toUnitId);
        if (!fromUnit || !toUnit) return;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "converter-recent-button";
        const strong = document.createElement("strong");
        const span = document.createElement("span");
        strong.textContent = entry.title;
        span.textContent = String(item.value) + " " + fromUnit.symbol + " → " + String(item.result) + " " + toUnit.symbol;
        button.append(strong, span);
        button.addEventListener("click", () => {
          if (filter) filter.value = "";
          if (category) category.value = "All";
          rebuildSource(entry.id + "::" + fromUnit.id, toUnit.id);
          fromInput.value = item.value;
          convertNow();
        });
        recent.appendChild(button);
      });
    };

    const updateContext = () => {
      if (!fromSelect.value) return;
      const { familyId, unitId } = splitValue(fromSelect.value);
      const entry = byId[familyId];
      const source = entry.units.find((u) => u.id === unitId);
      fromInput.inputMode = source.inputMode || "decimal";
      if (familyLabel) familyLabel.textContent = entry.title;
      if (note) {
        note.textContent = entry.note || "";
        note.hidden = !entry.note;
      }
    };

    const convertNow = () => {
      if (error) error.textContent = "";
      if (!fromSelect.value || !toSelect.value) {
        toInput.value = "";
        return;
      }
      try {
        const { familyId, unitId } = splitValue(fromSelect.value);
        if (!fromInput.value.trim()) {
          toInput.value = "";
          lastResult = "";
          saveState();
          return;
        }
        const result = convert(familyId, unitId, toSelect.value, fromInput.value);
        toInput.value = result.formatted;
        lastResult = result.formatted;
        saveState();
      } catch (err) {
        toInput.value = "";
        lastResult = "";
        if (error) error.textContent = err.message || "Conversion failed.";
      }
    };

    const rebuildSource = (preferredFrom, preferredTo) => {
      const selected = populateSource(
        fromSelect,
        filter ? filter.value : "",
        category ? category.value : "All",
        preferredFrom
      );
      if (!selected) {
        toSelect.innerHTML = '<option value="">No target units</option>';
        toSelect.disabled = true;
        fromInput.disabled = true;
        toInput.value = "";
        return;
      }
      fromInput.disabled = false;
      toSelect.disabled = false;
      populateTargets(toSelect, selected.familyId, preferredTo);
      updateContext();
      convertNow();
    };

    const savedFrom = state.from || config.defaultFrom || "rf-power::dbm";
    const savedTo = state.to || config.defaultTo || "mw";
    if (filter) filter.value = state.filter || "";
    fromInput.value = state.value || config.defaultValue || "23";
    rebuildSource(savedFrom, savedTo);

    if (filter) filter.addEventListener("input", () => rebuildSource(fromSelect.value, toSelect.value));
    if (category) category.addEventListener("change", () => rebuildSource(fromSelect.value, toSelect.value));

    fromSelect.addEventListener("change", () => {
      const { familyId } = splitValue(fromSelect.value);
      populateTargets(toSelect, familyId, null);
      updateContext();
      convertNow();
      addRecent();
    });

    toSelect.addEventListener("change", () => {
      convertNow();
      addRecent();
    });

    fromInput.addEventListener("input", convertNow);
    fromInput.addEventListener("change", addRecent);
    fromInput.addEventListener("blur", addRecent);

    if (swap) {
      swap.addEventListener("click", () => {
        if (!fromSelect.value || !toSelect.value) return;
        const current = splitValue(fromSelect.value);
        const entry = byId[current.familyId];
        const newFrom = current.familyId + "::" + toSelect.value;
        const newTo = current.unitId;
        const nextInput = toInput.value;
        if (filter) filter.value = "";
        if (category) category.value = "All";
        rebuildSource(newFrom, newTo);
        fromInput.value = nextInput;
        convertNow();
        addRecent();
      });
    }

    if (copy) {
      copy.addEventListener("click", () => {
        const current = splitValue(fromSelect.value);
        const entry = byId[current.familyId];
        const fromUnit = entry.units.find((u) => u.id === current.unitId);
        const toUnit = entry.units.find((u) => u.id === toSelect.value);
        const text = fromInput.value + " " + fromUnit.symbol + " = " + toInput.value + " " + toUnit.symbol;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            const previous = copy.textContent;
            copy.textContent = "Copied";
            setTimeout(() => { copy.textContent = previous; }, 1200);
          });
        }
      });
    }

    if (clear) {
      clear.addEventListener("click", () => {
        fromInput.value = "";
        toInput.value = "";
        lastResult = "";
        if (error) error.textContent = "";
        saveState();
        fromInput.focus();
      });
    }

    renderRecent();
    return { convertNow, rebuildSource, renderRecent };
  };

  window.FieldOpsConverter = {
    version: "1.0.0",
    families,
    categories,
    count: {
      families: families.length,
      units: families.reduce((sum, entry) => sum + entry.units.length, 0)
    },
    convert,
    listSourceOptions,
    mount
  };
})();
