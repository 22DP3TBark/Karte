

var LKS92WGS84 = (function()
{
    // KoordinÄtu pÄrveidojumos izmantotÄs konstantes
    LKS92WGS84.PI = Math.PI;                                    // Skaitlis pi
    LKS92WGS84.A_AXIS = 6378137;                                // Elipses modeÄ¼a lielÄ ass (a)
    LKS92WGS84.B_AXIS = 6356752.31414;                          // Elipses modeÄ¼a mazÄ ass (b)
    LKS92WGS84.CENTRAL_MERIDIAN = LKS92WGS84.PI * 24 / 180;     // CentrÄlais meridiÄns
    LKS92WGS84.OFFSET_X = 500000;                               // KoordinÄtu nobÄ«de horizontÄlÄs (x) ass virzienÄ
    LKS92WGS84.OFFSET_Y = -6000000;                             // KoordinÄtu nobÄ«de vertikÄlÄs (y) ass virzienÄ
    LKS92WGS84.SCALE = 0.9996;                                  // Kartes mÄ“rogojuma faktors (reizinÄtÄjs)

    function LKS92WGS84() {}

    // AprÄ“Ä·ina loka garumu no ekvatora lÄ«dz dotÄ punkta Ä£eogrÄfiskajam platumam
    LKS92WGS84.getArcLengthOfMeridian = function(phi)
    {
        var alpha, beta, gamma, delta, epsilon, n;

        n = (LKS92WGS84.A_AXIS - LKS92WGS84.B_AXIS) / (LKS92WGS84.A_AXIS + LKS92WGS84.B_AXIS);
        alpha = ((LKS92WGS84.A_AXIS + LKS92WGS84.B_AXIS) / 2) * (1 + (Math.pow(n, 2) / 4) + (Math.pow(n, 4) / 64));
        beta = (-3 * n / 2) + (9 * Math.pow(n, 3) / 16) + (-3 * Math.pow(n, 5) / 32);
        gamma = (15 * Math.pow(n, 2) / 16) + (-15 * Math.pow(n, 4) / 32);
        delta = (-35 * Math.pow(n, 3) / 48) + (105 * Math.pow(n, 5) / 256);
        epsilon = (315 * Math.pow(n, 4) / 512);

        return alpha * (phi + (beta * Math.sin(2 * phi)) + (gamma * Math.sin(4 * phi)) + (delta * Math.sin(6 * phi)) + (epsilon * Math.sin(8 * phi)));
    };

    // AprÄ“Ä·ina Ä£eogrÄfisko platumu centrÄlÄ meridiÄna punktam
    LKS92WGS84.getFootpointLatitude = function(y)
    {
        var yd, alpha, beta, gamma, delta, epsilon, n;

        n = (LKS92WGS84.A_AXIS - LKS92WGS84.B_AXIS) / (LKS92WGS84.A_AXIS + LKS92WGS84.B_AXIS);
        alpha = ((LKS92WGS84.A_AXIS + LKS92WGS84.B_AXIS) / 2) * (1 + (Math.pow(n, 2) / 4) + (Math.pow(n, 4) / 64));
        yd = y / alpha;
        beta = (3 * n / 2) + (-27 * Math.pow(n, 3) / 32) + (269 * Math.pow(n, 5) / 512);
        gamma = (21 * Math.pow(n, 2) / 16) + (-55 * Math.pow(n, 4) / 32);
        delta = (151 * Math.pow(n, 3) / 96) + (-417 * Math.pow(n, 5) / 128);
        epsilon = (1097 * Math.pow(n, 4) / 512);

        return yd + (beta * Math.sin(2 * yd)) + (gamma * Math.sin(4 * yd)) + (delta * Math.sin(6 * yd)) + (epsilon * Math.sin(8 * yd));
    };

    // PÄrveido punkta Ä£eogrÄfiskÄ platuma, garuma koordinÄtas par x, y koordinÄtÄm (bez pÄrvietojuma un mÄ“rogojuma)
    LKS92WGS84.convertMapLatLngToXY = function(phi, lambda, lambda0)
    {
        var N, nu2, ep2, t, t2, l,
            l3coef, l4coef, l5coef, l6coef, l7coef, l8coef,
            xy = [0, 0];

        ep2 = (Math.pow(LKS92WGS84.A_AXIS, 2) - Math.pow(LKS92WGS84.B_AXIS, 2)) / Math.pow(LKS92WGS84.B_AXIS, 2);
        nu2 = ep2 * Math.pow(Math.cos(phi), 2);
        N = Math.pow(LKS92WGS84.A_AXIS, 2) / (LKS92WGS84.B_AXIS * Math.sqrt(1 + nu2));
        t = Math.tan(phi);
        t2 = t * t;

        l = lambda - lambda0;
        l3coef = 1 - t2 + nu2;
        l4coef = 5 - t2 + 9 * nu2 + 4 * (nu2 * nu2);
        l5coef = 5 - 18 * t2 + (t2 * t2) + 14 * nu2 - 58 * t2 * nu2;
        l6coef = 61 - 58 * t2 + (t2 * t2) + 270 * nu2 - 330 * t2 * nu2;
        l7coef = 61 - 479 * t2 + 179 * (t2 * t2) - (t2 * t2 * t2);
        l8coef = 1385 - 3111 * t2 + 543 * (t2 * t2) - (t2 * t2 * t2);

        // x koordinÄta
        xy[0] = N * Math.cos(phi) * l + (N / 6 * Math.pow(Math.cos(phi), 3) * l3coef * Math.pow(l, 3)) + (N / 120 * Math.pow(Math.cos(phi), 5) * l5coef * Math.pow(l, 5)) + (N / 5040 * Math.pow(Math.cos(phi), 7) * l7coef * Math.pow(l, 7));

        // y koordinÄta
        xy[1] = LKS92WGS84.getArcLengthOfMeridian(phi) + (t / 2 * N * Math.pow(Math.cos(phi), 2) * Math.pow(l, 2)) + (t / 24 * N * Math.pow(Math.cos(phi), 4) * l4coef * Math.pow(l, 4)) + (t / 720 * N * Math.pow(Math.cos(phi), 6) * l6coef * Math.pow(l, 6)) + (t / 40320 * N * Math.pow(Math.cos(phi), 8) * l8coef * Math.pow(l, 8));

        return xy;
    };

    // PÄrveido punkta x, y koordinÄtas par Ä£eogrÄfiskÄ platuma, garuma koordinÄtÄm (bez pÄrvietojuma un mÄ“rogojuma)
    LKS92WGS84.convertMapXYToLatLon = function(x, y, lambda0)
    {
        var phif, Nf, Nfpow, nuf2, ep2, tf, tf2, tf4, cf,
            x1frac, x2frac, x3frac, x4frac, x5frac, x6frac, x7frac, x8frac,
            x2poly, x3poly, x4poly, x5poly, x6poly, x7poly, x8poly,
            latLng = [0, 0];

        phif = LKS92WGS84.getFootpointLatitude(y);
        ep2 = (Math.pow(LKS92WGS84.A_AXIS, 2) - Math.pow(LKS92WGS84.B_AXIS, 2)) / Math.pow(LKS92WGS84.B_AXIS, 2);
        cf = Math.cos(phif);
        nuf2 = ep2 * Math.pow(cf, 2);
        Nf = Math.pow(LKS92WGS84.A_AXIS, 2) / (LKS92WGS84.B_AXIS * Math.sqrt(1 + nuf2));
        Nfpow = Nf;

        tf = Math.tan(phif);
        tf2 = tf * tf;
        tf4 = tf2 * tf2;

        x1frac = 1 / (Nfpow * cf);

        Nfpow *= Nf;    // Nf^2
        x2frac = tf / (2 * Nfpow);

        Nfpow *= Nf;    // Nf^3
        x3frac = 1 / (6 * Nfpow * cf);

        Nfpow *= Nf;    // Nf^4
        x4frac = tf / (24 * Nfpow);

        Nfpow *= Nf;    // Nf^5
        x5frac = 1 / (120 * Nfpow * cf);

        Nfpow *= Nf;    // Nf^6
        x6frac = tf / (720 * Nfpow);

        Nfpow *= Nf;    // Nf^7
        x7frac = 1 / (5040 * Nfpow * cf);

        Nfpow *= Nf;    // Nf^8
        x8frac = tf / (40320 * Nfpow);

        x2poly = -1 - nuf2;
        x3poly = -1 - 2 * tf2 - nuf2;
        x4poly = 5 + 3 * tf2 + 6 * nuf2 - 6 * tf2 * nuf2 - 3 * (nuf2 * nuf2) - 9 * tf2 * (nuf2 * nuf2);
        x5poly = 5 + 28 * tf2 + 24 * tf4 + 6 * nuf2 + 8 * tf2 * nuf2;
        x6poly = -61 - 90 * tf2 - 45 * tf4 - 107 * nuf2 + 162 * tf2 * nuf2;
        x7poly = -61 - 662 * tf2 - 1320 * tf4 - 720 * (tf4 * tf2);
        x8poly = 1385 + 3633 * tf2 + 4095 * tf4 + 1575 * (tf4 * tf2);

        // Ä¢eogrÄfiskais platums
        latLng[0] = phif + x2frac * x2poly * (x * x) + x4frac * x4poly * Math.pow(x, 4) + x6frac * x6poly * Math.pow(x, 6) + x8frac * x8poly * Math.pow(x, 8);

        // Ä¢eogrÄfiskais garums
        latLng[1] = lambda0 + x1frac * x + x3frac * x3poly * Math.pow(x, 3) + x5frac * x5poly * Math.pow(x, 5) + x7frac * x7poly * Math.pow(x, 7);

        return latLng;
    };

    // PÄrveido punkta Ä£eogrÄfiskÄ platuma, garuma koordinÄtas par x, y koordinÄtÄm (ar pÄrvietojumu un mÄ“rogojumu)
    LKS92WGS84.convertLatLonToXY = function(coordinates)
    {
        var lat = coordinates[0] * LKS92WGS84.PI / 180,
            lng = coordinates[1] * LKS92WGS84.PI / 180,
            xy = LKS92WGS84.convertMapLatLngToXY(lat, lng, LKS92WGS84.CENTRAL_MERIDIAN);

        xy[0] = xy[0] * LKS92WGS84.SCALE + LKS92WGS84.OFFSET_X;
        xy[1] = xy[1] * LKS92WGS84.SCALE + LKS92WGS84.OFFSET_Y;

        if (xy[1] < 0) {
            xy[1] += 10000000;
        }

        return xy;
    };

    // PÄrveido punkta x, y koordinÄtas par Ä£eogrÄfiskÄ platuma, garuma koordinÄtÄm (ar pÄrvietojumu un mÄ“rogojumu)
    LKS92WGS84.convertXYToLatLon = function(coordinates)
    {
        var x = (coordinates[0] - LKS92WGS84.OFFSET_X) / LKS92WGS84.SCALE,
            y = (coordinates[1] - LKS92WGS84.OFFSET_Y) / LKS92WGS84.SCALE,
            latLng = LKS92WGS84.convertMapXYToLatLon(x, y, LKS92WGS84.CENTRAL_MERIDIAN);

        latLng[0] = latLng[0] / LKS92WGS84.PI * 180;
        latLng[1] = latLng[1] / LKS92WGS84.PI * 180;

        return latLng;
    };

    return LKS92WGS84;
})();


