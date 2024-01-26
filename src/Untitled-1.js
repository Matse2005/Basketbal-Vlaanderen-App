sportModule.filter("upComing", function () {
  return function (e, t) {
    if (!e || !e.length) return;
    let a = Date.now();
    return (
      (a += 36e5),
      e.filter(function (e) {
        return 1 === t ? e.jsDTCode >= a : e.jsDTCode < a;
      })
    );
  };
}),
  sportModule.filter("chkThuisUit", function () {
    return function (e, t, a) {
      if (e && e.length && (!t || !a))
        return t || a
          ? e.filter(function (e) {
              return t ? e.speeltThuis : a ? e.speeltUit : void 0;
            })
          : e;
    };
  }),
  sportModule.controller("ClubDetailController", [
    "$rootScope",
    "$scope",
    "$http",
    "$window",
    "$timeout",
    "WQData",
    "wqGlobal",
    function (e, t, i, n, d, r, u) {
      function o(a, i) {
        (t.newCat4Wed = a), e.UpdateVrijeMatchMetXHR("ADD");
      }
      (t.init = function (o, s) {
        (t.guid = o),
          (t.firstDate = new Date()),
          (t.secondDate = "2020-05-20"),
          (t.wqVW = []),
          (t.wqVW.OnlyTeamThuisUitslag = !1),
          (t.wqVW.OnlyTeamUitUitslag = !1),
          (t.wqVW.OnlyTeamThuisProg = !1),
          (t.wqVW.OnlyTeamUitUitProg = !1),
          (e.wqVWZ = []),
          (e.wqDatePeriode = []);
        const c = new Date(),
          m = c.getFullYear();
        c.getMonth() < 6
          ? ((e.minWedYear = m - 1), (e.maxWedYear = m))
          : ((e.maxWedYear = m + 1), (e.minWedYear = m)),
          (e.wqDatePeriode.minWedDatum = e.minWedYear.toString() + "-06-01"),
          (e.wqDatePeriode.maxWedDatum = e.maxWedYear.toString() + "-06-30"),
          (e.userRelGuid = "na"),
          (t.vrijeMatchEditAllowed = !1),
          (t.isVrijWed = !1),
          (t.OefenMatches = []),
          (function (a) {
            if (!r.loggedIn()) return !1;
            (t.vrijeMatchEditAllowed = !1), (e.userRelGuid = r.getRelguid());
            const i = r.getRollen();
            if (null === i) return !0;
            const n = i[0].Description;
            JSON.parse(n).curOrgGuids.length;
            let d = i.filter(function (e) {
              return (
                "KalVerantw" === e.AccountRolType &&
                e.AccountGuid.substring(0, 8) === t.guid
              );
            })[0];
            null != d &&
              "KalVerantw" === d.AccountRolType &&
              d.AccountGuid.substring(0, 8) === t.guid &&
              (t.vrijeMatchEditAllowed = !0);
          })(),
          i
            .get(e.sportModuleBaseUrl + "/OrgDetailByGuid?issguid=" + t.guid)
            .then(function (e) {
              let i = e.data;
              0 === i.length &&
                (u.wqAlert("Club niet gevonden of niet meer actief!"),
                (n.location.href = "/Home/ClubList")),
                (t.club = i);
              let d = i[0];
              (t.clubNaam = d.naam),
                (t.loadLedenNeeded = !0),
                (t.teams = d.teams),
                (t.themecolor = "");
              let o = "";
              if (t.teams.length > 0) {
                t.teams.forEach(function (e) {
                  null !== e.shirtKleur &&
                    ("#ffffff" === e.shirtKleur
                      ? (t.themecolor = e.shirtReserve)
                      : (t.themecolor = e.shirtKleur),
                    (o = (function (e) {
                      let t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
                        e
                      );
                      return t
                        ? {
                            r: parseInt(t[1], 16),
                            g: parseInt(t[2], 16),
                            b: parseInt(t[3], 16),
                          }
                        : null;
                    })(t.themecolor)));
                });
                let e = 0,
                  i = 0,
                  n = 0;
                0 === o.r && 255 === o.g
                  ? ((e = o.r + 50), (i = o.g - 100), (n = o.b + 50))
                  : 0 === o.r
                  ? ((e = o.r + 20), (i = o.g + 20), (n = o.b - 70))
                  : 255 === o.r
                  ? ((e = o.r - 100), (i = o.g - 100), (n = o.b - 155))
                  : ((e = o.r - 50), (i = o.g - 50), (n = o.b)),
                  (a = 1);
                const d = e + "," + i + "," + n;
                t.rgba = "rgba(" + d + ")";
                let r = e + "," + i + "," + n + "," + a,
                  s = e + "," + i + "," + n;
                (t.rgba = "rgba(" + s + ")"),
                  u.setClubstyleSheet(t.themecolor, r, t.rgba);
              }
              (t.loadWedsNeeded = !0), (t.bestuur = d.bestuur);
              let s = "";
              t.bestuur.forEach(function (e) {
                "Secretaris" == e.kenmerk && (s = "tav: " + e.naam),
                  r.loggedIn() ||
                    ((e.email = ""), (e.telefoon = ""), (e.mobiel = ""));
              }),
                "" != d.email && (s += "  E-mail: " + d.email),
                (t.tavNaam = s);
              let c = "";
              null !== d.adres.huisNrToev && (c = "/" + d.adres.huisNrToev),
                (t.adres =
                  d.adres.straat +
                  " " +
                  d.adres.huisNr +
                  c +
                  "  " +
                  d.adres.postcode +
                  " " +
                  d.adres.plaats),
                (t.plaats = d.plaats),
                (t.website = d.website),
                (t.weburlLink = t.website),
                null != t.weburlLink &&
                  "http" !== t.weburlLink.substring(1, 4) &&
                  (t.weburlLink = "http://" + t.weburlLink);
            }),
          "" !== s &&
            d(function () {
              angular
                .element(".nav.nav-tabs")[0]
                .children[3].children.item(0)
                .click(),
                (t.query = s);
            }),
          (e.isModalShow = !1);
      }),
        (t.addToFavorites = function () {
          r.addToFavorites(t.guid, t.clubNaam, "100");
        }),
        (t.isInFavorites = function () {
          return r.isInFavorites(t.guid);
        }),
        (t.loadWeds = function () {
          if (!1 === t.loadWedsNeeded) return;
          i.get(
            e.sportModuleBaseUrl + "/OrgMatchesByGuid?issguid=" + t.guid
          ).then(function (e) {
            t.matches = e.data;
            let a = Date.now();
            (a -= 72e5),
              t.matches.forEach(function (e) {
                (e.teamTclubGuid = e.tTGUID.substring(0, 8)),
                  (e.teamUclubGuid = e.tUGUID.substring(0, 8)),
                  (e.speeltThuis = e.teamTclubGuid === t.guid),
                  (e.speeltUit = e.teamUclubGuid === t.guid),
                  e.jsDTCode > a &&
                    e.uitslag.indexOf("FOR") > 0 &&
                    (e.beginTijd = "Let op!! Forfait.");
              }),
              (t.loadWedsNeeded = !1);
          });
        }),
        (t.GetLeden = function (a) {
          !1 !== t.loadLedenNeeded &&
            null !== e.userRelGuid &&
            "na" !== e.userRelGuid &&
            i
              .get(
                e.sportModuleBaseUrl + "/RelatiesByOrgGuid?orgguid=" + t.guid
              )
              .then(function (e) {
                (t.leden = e.data),
                  t.leden.forEach(function (e) {
                    let t = e.orgLMS.substring(0, 6),
                      a = "";
                    switch (t) {
                      case "BVBLSL":
                        (a = e.orgLMS.substring(6, 7)),
                          (e.orgLMS = e.orgLMS.substring(8) + a + " Speler ");
                        break;
                      case "BVBLRS":
                        e.orgLMS = e.orgLMS.substring(8) + ", R-BAB ";
                        break;
                      case "BVBLAL":
                        e.orgLMS = e.orgLMS.substring(8) + ", Lid";
                        break;
                      case "BVBLCO":
                        e.orgLMS = e.orgLMS.substring(8) + ", Coach";
                        break;
                      default:
                        e.orgLMS = e.orgLMS.substring(8) + ", " + t;
                    }
                    e.volledigeNaam = e.vnaam + " " + e.naam;
                  }),
                  (t.loadLedenNeeded = !1);
              });
        }),
        (t.loadOefenWeds = function () {
          (t.showOefenWedTab = !1), e.UpdateVrijeMatchMetXHR("GETALL");
        }),
        (t.showOefenWedTab = !1),
        (t.editWed = function (e) {
          if (((t.showOefenWedTab = !t.showOefenWedTab), null != e)) {
            (t.match2Edit = e),
              (t.originalDate = e.DatumString),
              (t.originalTime = e.BeginTijd),
              (t.originalAccomm = e.AccommNaam),
              (t.originalTeamThuisNaam = e.TeamThuisNaam),
              (t.originalTeamUitNaam = e.TeamUitNaam),
              (t.originalTeamTGuid = e.teamTclubGuid),
              (t.originalTeamUGuid = e.teamUclubGuid),
              (t.match2Edit.DuurPeriodeSecs = e.DuurPeriodeSecs),
              (t.wqVW = JSON.parse(JSON.stringify(e))),
              (t.wqVW.AantOfficials = t.wqVW.AantOfficials.toString()),
              (t.wqVW.AantSpOpVeld = t.wqVW.AantSpOpVeld.toString()),
              (t.wqVW.AantPeriodes = t.wqVW.AantPeriodes.toString()),
              (t.wqVW.AantTO = t.wqVW.AantTO.toString()),
              (t.wqVW.MaxAantFoutenPeriode =
                t.wqVW.MaxAantFoutenPeriode.toString()),
              (t.match2Edit.AantSpOpVeld = t.wqVW.AantSpOpVeld),
              (t.match2Edit.MaxAantFoutenPeriode =
                t.wqVW.MaxAantFoutenPeriode.toString());
            let a = parseInt(e.BeginTijd.substring(0, 2)),
              i = parseInt(e.BeginTijd.substring(3, 5)),
              n = parseInt(e.DatumString.substring(0, 2)),
              d = parseInt(e.DatumString.substring(3, 5)) - 1,
              r = parseInt(e.DatumString.substring(6, 10));
            (t.wqVW.Datum = new Date(r, d, n, 0, 0)),
              (t.wqVW.BeginTijd = new Date(2e3, 1, 1, a, i));
          }
        }),
        (t.OpslaanOefWed = function () {
          t.wqVW.date;
          if (null != t.wqVW.Datum) {
            let e = t.wqVW.Datum.getFullYear();
            if (Number.isNaN(e)) t.match2Edit.DatumString = "";
            else {
              let a = t.wqVW.Datum.getMonth() + 1,
                i = t.wqVW.Datum.getDate();
              NaN !== e &&
                (t.match2Edit.DatumString =
                  ("00" + i).slice(-2) + "-" + ("00" + a).slice(-2) + "-" + e);
            }
          }
          if (null != t.wqVW.BeginTijd) {
            let e = t.wqVW.BeginTijd.getHours(),
              a = t.wqVW.BeginTijd.getMinutes();
            isNaN(e) || isNaN(a)
              ? (t.match2Edit.BeginTijd = "")
              : (t.match2Edit.BeginTijd =
                  ("00" + e).slice(-2) + "." + ("00" + a).slice(-2));
          }
          (t.match2Edit.TeamThuisGUID = t.wqVW.TeamThuisGUID),
            (t.match2Edit.TeamThuisNaam = t.wqVW.TeamThuisNaam),
            (t.match2Edit.TeamUitGUID = t.wqVW.TeamUitGUID),
            (t.match2Edit.TeamUitNaam = t.wqVW.TeamUitNaam),
            (t.match2Edit.AantPeriodes = parseInt(t.wqVW.AantPeriodes)),
            (t.match2Edit.DuurPeriodeSecs = t.wqVW.DuurPeriodeSecs),
            (t.match2Edit.AantSpOpVeld = parseInt(t.wqVW.AantSpOpVeld)),
            (t.match2Edit.AccommNaam = t.wqVW.AccommNaam),
            (t.match2Edit.AccommStraat = t.wqVW.AccommStraat),
            (t.match2Edit.AccommHuisNr = t.wqVW.AccommHuisNr),
            (t.match2Edit.AccommHuisNrToev = t.wqVW.AccommHuisNrToev),
            (t.match2Edit.AccommPostcode = t.wqVW.AccommPostcode),
            (t.match2Edit.AccommPlaats = t.wqVW.AccommPlaats),
            (t.match2Edit.AccommGUID = t.wqVW.AccommGUID),
            (t.match2Edit.AantTO = parseInt(t.wqVW.AantTO)),
            (t.match2Edit.MaxAantFoutenPeriode = parseInt(
              t.wqVW.MaxAantFoutenPeriode
            )),
            (t.match2Edit.Scores = t.wqVW.Scores),
            (t.match2Edit.AantOfficials = parseInt(t.wqVW.AantOfficials)),
            e.UpdateVrijeMatchMetXHR("UPDCURMATCH"),
            (t.showOefenWedTab = !t.showOefenWedTab);
        }),
        (t.tabSel = function (t) {
          e.tabSelected = t;
        }),
        (t.searchModal = function (a) {
          (e.showTable = !1),
            (e.notFound = !1),
            (e.results = []),
            (e.teamTUA = a),
            (e.wqVWZ.zoekMethode = a),
            (("T" === a &&
              "BVBL1514xxx000" == t.match2Edit.TeamThuisGUID &&
              "Team A" != t.match2Edit.TeamThuisNaam) ||
              ("U" === a &&
                "BVBL1514xxx000" == t.match2Edit.TeamUitGUID &&
                "Team B" != t.match2Edit.TeamUitNaam) ||
              ("A" === a &&
                null != t.match2Edit.AccommNaam &&
                t.match2Edit.AccommNaam.length > 1 &&
                null == t.match2Edit.AccommGUID)) &&
              (e.tabSelected = "Handmade"),
            (e.tabSelected = "Zoek"),
            $("#MainForm").modal("show");
        }),
        (t.confirmModal = function (e) {
          $("#MainConfirm").modal("show");
        }),
        (t.deleteWed = function (a) {
          const i = [];
          i.push({
            buttonText: "Verwijder wedstrijd",
            func: function () {
              !(function (a) {
                (t.match2Edit = a), e.UpdateVrijeMatchMetXHR("REM", a.GUID);
              })(a);
            },
          }),
            e.wqVraag(
              `Wedstrijd ${a.WedID} verwijderen?`,
              [` ${a.TeamThuisNaam}   - ${a.TeamUitNaam}`],
              i
            );
        }),
        (t.addVrijeMatch = function () {
          const t = [];
          t.push({
            buttonText: "Senioren",
            func: function () {
              o("HSE");
            },
          }),
            t.push({
              buttonText: "U10",
              func: function (e) {
                o("U10");
              },
            }),
            t.push({
              buttonText: "U08",
              func: function (e) {
                o("U08");
              },
            }),
            e.wqVraag(
              "Wedstrijd toevoegen",
              ["Gebruik DWF instellingen van"],
              t
            );
        }),
        (t.ToggleZoekHand = function () {
          "Handmade" === t.tabSelected
            ? (t.tabSelected = "Zoek")
            : (t.tabSelected = "Handmade");
        }),
        (t.setTUA = function (a, i) {
          "T" === e.teamTUA &&
            ("handMade" === i &&
              ((t.tabSelectedId = "handmatig"),
              (t.wqVW.TeamThuisGUID = "BVBL1514xxx000"),
              (t.match2Edit.teamTclubGuid = "")),
            "handMade" != i &&
              ((t.tabSelectedId = "Zoeken"),
              (t.wqVW.TeamThuisGUID = a.Guid),
              (t.wqVW.TeamThuisNaam = a.Naam),
              (t.wqVW.teamTclubGuid = a.OrgGuid),
              (t.match2Edit.TeamThuisGUID = a.Guid),
              (t.match2Edit.TeamThuisNaam = a.Naam),
              (t.match2Edit.teamTclubGuid = a.OrgGuid))),
            "U" === e.teamTUA &&
              ("handMade" === i &&
                ((t.wqVW.TeamUitGUID = "BVBL1514xxx000"),
                (t.match2Edit.teamUclubGuid = "")),
              "handMade" != i &&
                ((t.wqVW.TeamUitGUID = a.Guid),
                (t.wqVW.TeamUitNaam = a.Naam),
                (t.wqVW.teamUclubGuid = a.OrgGuid),
                (t.match2Edit.TeamUitGUID = a.Guid),
                (t.match2Edit.TeamUitNaam = a.Naam),
                (t.match2Edit.teamUclubGuid = a.OrgGuid))),
            "A" === e.teamTUA &&
              ("handMade" != i &&
                ((t.wqVW.AccommNaam = a.Naam), (t.wqVW.AccommGUID = a.Guid)),
              "handMade" === i &&
                ((t.match2Edit.AccommNaam = t.wqVW.AccommNaam),
                (t.match2Edit.AccommGUID = null),
                (t.match2Edit.AccommPlaats = t.wqVW.AccommPlaats),
                (t.wqVW.AccommGUID = null))),
            $("#MainForm").modal("hide");
        }),
        (t.addUUpdateVrijMatch = function (e) {
          $("#WQmodalWedInS").modal("show");
        }),
        (e.UpdateVrijeMatchMetXHR = function (a, i) {
          if ("GET" != a)
            try {
              let n = null,
                d = new XMLHttpRequest();
              d.addEventListener("readystatechange", function () {
                if (4 === this.readyState) {
                  d.response;
                  if (200 == this.status) {
                    if (
                      ((t.ResponseText = this.responseText),
                      (t.data = JSON.parse(this.responseText)),
                      "GETALL" == a &&
                        ((t.OefenMatches = t.data),
                        t.OefenMatches.forEach(function (e) {
                          (e.teamTclubGuid = e.TeamThuisGUID.substring(0, 8)),
                            (e.speeltThuis = e.teamTclubGuid == t.guid),
                            (e.teamUclubGuid = e.TeamUitGUID.substring(0, 8)),
                            (e.speeltUit = e.teamUclubGuid == t.guid);
                        })),
                      "ADD" == a)
                    ) {
                      let e = t.data[0];
                      (e.teamTclubGuid = e.TeamThuisGUID.substring(0, 8)),
                        (e.speeltThuis = e.teamTclubGuid == t.guid),
                        (e.teamUclubGuid = e.TeamUitGUID.substring(0, 8)),
                        (e.speeltUit = e.teamUclubGuid == t.guid),
                        t.OefenMatches.push(e);
                    }
                    if ("UPDCURMATCH" == a) {
                      let e = t.data[0];
                      t.match2Edit.JsDTCode = e.JsDTCode;
                    }
                    if ("REM" == a) {
                      let e = t.match2Edit.GUID,
                        a = t.OefenMatches.findIndex((t) => t.GUID === e);
                      -1 !== a && t.OefenMatches.splice(a, 1);
                    }
                    t.$apply();
                  } else
                    (400 == this.status &&
                      -1 !== this.responseText.indexOf("Geen?? ")) ||
                      (0 == this.status
                        ? u.wqAlert("Verbinding met server niet mogelijk!")
                        : u.wqAlert(
                            "Username onbekend en/of wachtwoord onjuist!"
                          ));
                }
              });
              let o = e.sportModuleBaseUrl + "/VrijeMatchManager";
              d.open("PUT", o, !0),
                d.setRequestHeader("authorization", r.getAutheader()),
                d.setRequestHeader(
                  "Content-type",
                  "application/json; charset=utf-8"
                );
              let s = {
                Naam: "tGAndre",
                WQVer: t.currentversion,
                GUID: "Gandre1",
                TsetExtra: "test",
              };
              if (
                ("GET" == a &&
                  (s = {
                    AuthHeader: r.getAutheader(),
                    WQVer: t.currentversion,
                    WedGUID: t.guid,
                    CRUD: "R",
                  }),
                "GETALL" == a &&
                  (s = {
                    AuthHeader: r.getAutheader(),
                    WQVer: t.currentversion,
                    WedGUID: t.guid,
                    OrgGuidEnCat4Wed: t.guid,
                    CRUD: "R",
                  }),
                "UPDCURMATCH" == a &&
                  ((s = {
                    AuthHeader: r.getAutheader(),
                    WQVer: t.currentversion,
                    WedGUID: t.match2Edit.GUID,
                    CRUD: "U",
                  }).dwfMatchInfo = t.match2Edit),
                "ADD" == a)
              ) {
                let e = {
                  aantPeriodes: 4,
                  duurPeriode: 600,
                  duurTO: 60,
                  aantTO: 2,
                  maxAantFoutenPeriode: 4,
                  aantSpelerOpVeld: 5,
                  scores: "123",
                  dwfPdf: null,
                  dwfTafel:
                    "1e,V; 2e,N; 3e,N; Score,V; Time,V; 24sec,V; Comm,N;",
                  dwfInfo: null,
                };
                ((s = {
                  AuthHeader: r.getAutheader(),
                  WQVer: t.currentversion,
                  WedGUID: "NA",
                  CRUD: "C",
                  OrgGuidEnCat4Wed: t.guid + ":" + t.newCat4Wed,
                }).dwfI4Match = e),
                  (curDwfMatchInfo = {
                    TeamThuisGUID: "TTG",
                    TeamThuisNaam: "TTNaam",
                  }),
                  (s.dwfMatchInfo = curDwfMatchInfo);
              }
              "REM" == a &&
                (s = {
                  AuthHeader: r.getAutheader(),
                  WQVer: t.currentversion,
                  WedGUID: i,
                  CRUD: "D",
                }),
                "RESET" == a &&
                  (s = {
                    AuthHeader: r.getAutheader(),
                    WQVer: t.currentversion,
                    WedGUID: t.guid,
                    TU: e.TUO,
                    CRUD: "F",
                  }),
                (n = JSON.stringify(s)),
                d.send(n);
            } catch (e) {}
        });
    },
  ]);

sportModule.filter("upComing", function () {
  return function (e, t) {
    if (e && e.length) {
      var r = Date.now();
      return (
        (r += 36e5),
        e.filter(function (e) {
          return 1 === t ? e.jsDTCode >= r : e.jsDTCode < r;
        })
      );
    }
  };
}),
  sportModule.controller("TeamDetailController", [
    "$rootScope",
    "$scope",
    "$window",
    "$http",
    "WQData",
    "wqGlobal",
    function (e, t, r, l, n, o) {
      (t.sportModuleBaseUrl = e.sportModuleBaseUrl),
        (t.sportModuleClubLogoUrlPrefix = e.sportModuleClubLogoUrlPrefix);
      e.sportModuleSboServerUrl;
      t.init = function (i) {
        (t.currentversion = "tdc1.1"),
          (t.guid = i),
          (t.tGuid = t.guid.replace(" ", "+").replace(" ", "+")),
          (t.clubGuid = t.tGuid.substr(0, 8)),
          (t.tGuid4cal = t.guid.replace(" ", "0").replace(" ", "0")),
          t.GoogleCal(),
          (t.ShowFavIcon = !0),
          (t.IsLoggedIn = n.loggedIn()),
          (e.userRelGuid = n.getRelguid()),
          (t.loadLedenNeededClub = !0),
          (t.loadTafelDone = !1),
          (t.relnotfound = !1),
          (t.TESTAW =
            t.sportModuleBaseUrl + "/TeamDetailByGuid?teamGuid=" + t.tGuid),
          (t.clubLeden = { All: [] }),
          (null !== e.userRelGuid && "na" !== e.userRelGuid) ||
            ((t.loadLedenNeededClub = !1), (t.loadTafelDone = !0)),
          l
            .get(t.sportModuleBaseUrl + "/TeamDetailByGuid?teamGuid=" + t.tGuid)
            .then(function (a) {
              let l = a.data;
              var n;
              0 === l.length &&
                (o.wqAlert("Team niet gevonden!"),
                (r.location.href = "/Home/teamlist")),
                (t.weds = l);
              try {
                n = l[0];
              } catch (e) {}
              (t.clubguid = n.guid.substr(0, 8)),
                (t.TeamNaam = n.naam),
                (t.poules = []),
                n.poules.forEach(function (e) {
                  e.teams.length > 0 && t.poules.push(e);
                }),
                (t.loadWedsNeeded = !0),
                null !== e.userRelGuid &&
                  "na" !== e.userRelGuid &&
                  ((t.spelers = n.spelers), (t.tvLijst = n.tvlijst));
            }),
          l
            .get(
              t.sportModuleBaseUrl + "/OrgDetailByGuid?issguid=" + t.clubGuid
            )
            .then(function (e) {
              let l = e.data;
              0 === l.length &&
                (o.wqAlert("Club niet gevonden of niet meer actief!"),
                (r.location.href = "/Home/ClubList")),
                (t.club = l);
              var n = l[0];
              if (
                ((t.clubNaam = n.naam),
                (t.loadLedenNeeded = !0),
                (t.teams = n.teams),
                (t.themecolor = ""),
                (t.seccolor = ""),
                t.teams.forEach(function (e) {
                  var r, a;
                  null !== e.shirtKleur &&
                    ("#ffffff" === e.shirtKleur
                      ? (t.themecolor = e.shirtReserve)
                      : (t.themecolor = e.shirtKleur),
                    (seccolor =
                      ((r = t.themecolor),
                      (a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(r))
                        ? {
                            r: parseInt(a[1], 16),
                            g: parseInt(a[2], 16),
                            b: parseInt(a[3], 16),
                          }
                        : null)));
                }),
                0 === seccolor.r && 255 === seccolor.g)
              )
                var i = seccolor.r + 50,
                  s = seccolor.g - 100,
                  u = seccolor.b + 50;
              else if (0 === seccolor.r)
                (i = seccolor.r + 20),
                  (s = seccolor.g + 20),
                  (u = seccolor.b - 70);
              else
                255 === seccolor.r
                  ? ((i = seccolor.r - 100),
                    (s = seccolor.g - 100),
                    (u = seccolor.b - 155))
                  : ((i = seccolor.r - 50),
                    (s = seccolor.g - 50),
                    (u = seccolor.b));
              a = 1;
              const d = i + "," + s + "," + u;
              t.rgba = "rgba(" + d + ")";
              let c = i + "," + s + "," + u + "," + a;
              o.setClubstyleSheet(t.themecolor, c, t.rgba);
            });
      };
      (t.loadWeds = function () {
        !1 !== t.loadWedsNeeded &&
          l
            .get(
              t.sportModuleBaseUrl + "/TeamMatchesByGuid?teamGuid=" + t.tGuid
            )
            .then(function (e) {
              t.matches = e.data;
              var r = Date.now();
              (r -= 72e5),
                t.matches.forEach(function (e) {
                  (e.speeltThuis = !1),
                    (e.speeltUit = !1),
                    (e.teamTclubGuid = e.tTGUID.substring(0, 8)),
                    (e.teamUclubGuid = e.tUGUID.substring(0, 8)),
                    e.jsDTCode > r &&
                      e.uitslag.indexOf("FOR") > 0 &&
                      (e.beginTijd = "Let op!! Forfait.");
                }),
                (function (e) {
                  for (let r = 0; r < e.length; r++) {
                    let a = e[r].tTGUID.substring(0, 8);
                    (speeltUit = !1),
                      a === t.clubGuid
                        ? (e[r].speeltThuis = !0)
                        : (e[r].speeltUit = !0),
                      (t.matches = e);
                  }
                })(t.matches),
                (t.loadWedsNeeded = !1);
            });
      }),
        (t.chkIfAuthorized4Team = function () {
          if (!n.loggedIn())
            return (
              o.wqAlert(
                "Inloggen is vereist om wijzigingen aan te brengen of naar DWF te gaan!"
              ),
              !1
            );
          e.userRelGuid = n.getRelguid();
          var r = n.getRelguid();
          if ("" == r || "na" == r)
            return o.wqAlert("Account niet gekoppeld aan lidnummer!"), !1;
          var a = n.getRollen()[0].Description,
            l = JSON.parse(a).curOrgGuids,
            i = l.length;
          for (var s = !1, u = 0; u < i; u++) {
            var d = l[u];
            if (t.clubguid == d) {
              s = !0;
              break;
            }
          }
          return !(
            !s &&
            (o.wqAlert("Niet aangesloten bij club van dit team!"),
            "BVBL57508" != r && "BVBL185889" != r && "BVBL183253" != r)
          );
        }),
        (t.MainFormModal = function (e, r, a) {
          t.chkIfAuthorized4Team() &&
            ((t.AddTafelaarModalContent = !1),
            (t.DeleteTafelaarModalContent = !1),
            "AddTafelaar" === r &&
              (t.GetClubLeden(), (t.AddTafelaarModalContent = !0)),
            $("#MainForm").modal("show"));
        }),
        (t.manageSpelers = function (e, r) {
          return "AddTafelaar" == e
            ? ($("#MainForm").modal("hide"),
              (t.CurrRelGUID = r.relGuid),
              (t.CurrRelNr = r.relNr),
              (t.CurrGebDat = r.gebdat),
              (t.CurrNaam = r.volledigeNaam),
              void t.loadTafelMetXHR("MOD"))
            : "ZoekTafelaar" == e
            ? ((t.relnotfound = !1), void t.check4RelNrMetXHR("GET", t.relNr))
            : r
            ? ((t.CurrRelGUID = r.relGuid), void t.loadTafelMetXHR("REM"))
            : void 0;
        }),
        (t.GetClubLeden = function () {
          if (
            !1 !== t.loadLedenNeededClub &&
            null !== e.userRelGuid &&
            "na" !== e.userRelGuid
          ) {
            var r = null,
              a = t.clubguid;
            (r = t.clubLeden),
              (t.loadLedenNeededClub = !1),
              l
                .get(t.sportModuleBaseUrl + "/RelatiesByOrgGuid?orgguid=" + a)
                .then(function (e) {
                  (r.All = e.data),
                    e.data.forEach(function (e) {
                      (e.volledigeNaam = e.vnaam + " " + e.naam),
                        (e.uCat = e.cat);
                    }),
                    (t.leden = r.All);
                });
          }
        }),
        (t.loadTafelMetXHR = function (r) {
          if (
            null !== e.userRelGuid &&
            "na" !== e.userRelGuid &&
            ("GET" != r || !t.loadOffiDone)
          )
            try {
              var a,
                l = new XMLHttpRequest();
              l.addEventListener("readystatechange", function () {
                if (4 === this.readyState) {
                  l.response;
                  if (200 == this.status) {
                    t.ResponseText = this.responseText;
                    var e = JSON.parse(this.responseText);
                    if (null == e || "undefined" == e)
                      return (
                        (t.meldingNietGevonden = "Lidnummer niet gevonden!"),
                        (t.relnotfound = !0),
                        void t.$apply()
                      );
                    (t.data = JSON.parse(this.responseText)),
                      (t.tafelLijst = t.data.TafelLijst),
                      (t.loadTafelDone = !0),
                      (t.tt = ""),
                      t.$apply();
                  } else
                    0 == this.status
                      ? o.wqAlert("Verbinding met server niet mogelijk!")
                      : o.wqAlert(
                          "Username onbekend en/of wachtwoord onjuist!"
                        );
                }
              });
              var i = t.sportModuleBaseUrl + "/TeamTafelByTeamGuid";
              !0;
              n.getAutheader();
              l.open("PUT", i, !0),
                l.setRequestHeader("authorization", n.getAutheader()),
                l.setRequestHeader(
                  "Content-type",
                  "application/json; charset=utf-8"
                );
              var s = {
                Naam: "tGAndre",
                WQVer: "na:" + t.currentversion,
                GUID: "Gandre1",
                TsetExtra: "test",
              };
              "GET" == r &&
                (s = {
                  AuthHeader: n.getAutheader(),
                  WQVer: t.currentversion,
                  WedGUID: t.guid,
                  TeamGUID: t.guid,
                  CRUD: "R",
                }),
                ("ADD" != r && "MOD" != r) ||
                  (s = {
                    AuthHeader: n.getAutheader(),
                    WQVer: t.currentversion,
                    WedGUID: t.guid,
                    TeamGUID: t.guid,
                    Functie: "",
                    TU: "",
                    CRUD: "U",
                    RelGUID: t.CurrRelGUID,
                    RelNr: t.CurrRelNr,
                    Naam: t.CurrNaam,
                    GebDat: t.CurrGebDat,
                  }),
                "REM" == r &&
                  (s = {
                    AuthHeader: n.getAutheader(),
                    WQVer: t.currentversion,
                    WedGUID: t.guid,
                    TeamGUID: t.guid,
                    CRUD: "D",
                    RelGUID: t.CurrRelGUID,
                  }),
                (a = JSON.stringify(s)),
                l.send(a);
            } catch (e) {}
        }),
        (t.loadTafelLijst = function (e) {
          t.IsLoggedIn && (t.loadTafelDone || t.loadTafelMetXHR(e));
        }),
        (t.check4RelNrMetXHR = function (e, r) {
          try {
            var a,
              l = new XMLHttpRequest();
            l.addEventListener("readystatechange", function () {
              if (4 === this.readyState) {
                l.response;
                if (200 == this.status) {
                  t.ResponseText = this.responseText;
                  var r = JSON.parse(this.responseText);
                  if (null == r || "undefined" == r)
                    return (
                      (t.meldingNietGevonden = "Lidnummer niet gevonden!"),
                      (t.relnotfound = !0),
                      void t.$apply()
                    );
                  if ("GET" == e) {
                    var a = {
                      relGuid: r.relGuid,
                      relNr: r.LidNr,
                      gebdat: r.sGebDat,
                      volledigeNaam: r.Naam,
                    };
                    t.manageSpelers("AddTafelaar", a);
                  }
                  t.$apply();
                } else
                  400 == this.status &&
                  -1 !== this.responseText.indexOf("Geen SBO Official")
                    ? o.wqAlert("Geen SBO official. Inloggen niet mogelijk!")
                    : 0 == this.status
                    ? o.wqAlert("Verbinding met server niet mogelijk!")
                    : o.wqAlert("Username onbekend en/of wachtwoord onjuist!");
              }
            });
            var i = t.sportModuleBaseUrl + "/RelByRelNr";
            l.open("PUT", i, !0),
              l.setRequestHeader("authorization", n.getAutheader()),
              l.setRequestHeader(
                "Content-type",
                "application/json; charset=utf-8"
              );
            var s = {
              Naam: "tGAndre",
              WQVer: "na" + t.currentversion,
              GUID: "Gandre1",
              TsetExtra: "test",
            };
            "GET" == e &&
              (s = {
                AuthHeader: n.getAutheader(),
                WQVer: t.currentversion,
                WedGUID: t.guid,
                CRUD: "R",
                relNr: r,
                RelGUID: "VISUteam",
              }),
              (a = JSON.stringify(s)),
              l.send(a);
          } catch (e) {}
        }),
        (t.GoogleCal = function () {
          (t.wquri = "webcal://vblcal.wisseq.eu/vblcalsync/calsync.aspx?guid="),
            (t.wquriPaste =
              "https://vblcal.wisseq.eu/vblcalsync/calsync.aspx?guid="),
            (t.uri = "https://www.google.com/calendar/render?cid=" + t.wquri),
            (t.UrlToOthercal =
              "webcal://vblcal.wisseq.eu/vblcalsync/calsync.aspx?guid="),
            (t.urlGooglecal = t.uri + t.tGuid4cal),
            (t.urlGooglecalText = t.wquriPaste + t.tGuid4cal),
            (t.OtherCal = t.UrlToOthercal + t.tGuid4cal);
        }),
        (t.addToFavorites = function () {
          n.addToFavorites(t.guid, t.TeamNaam, "102");
        }),
        (t.isInFavorites = function () {
          return n.isInFavorites(t.guid);
        }),
        (t.pagingFunction = function () {}),
        (t.goToStats = function () {
          if (!n.loggedIn())
            return (
              o.wqAlert("Inloggen is vereist om naar statistieken te gaan!"), !1
            );
          t.username = n.getUsername();
          var e =
            "https://vblstats.wisseq.eu/login/" + t.username + "/" + t.guid;
          window.open(e, "_blank");
        });
    },
  ]);

("use strict");
sportModule.controller("MatchDetailController", [
  "$rootScope",
  "$scope",
  "$http",
  "WQData",
  "$sce",
  "wqGlobal",
  function (t, e, a, i, r, n) {
    (e.sportModuleBaseUrl = t.sportModuleBaseUrl),
      (e.dwfUrl = t.dwfUrl),
      (e.dwfUrlBeta = t.dwfUrlBeta),
      (e.showUrlBetaBtn = e.dwfUrlBeta.startsWith("https")),
      (t.sportModuleClubLogoUrlPrefix = t.sportModuleClubLogoUrlPrefix),
      (e.wqM = []),
      (e.wqM.scorethuis = ""),
      (e.wqM.scoreuit = ""),
      (e.wqM.pin = ""),
      (e.init = function (a) {
        (t.userRelGuid = i.getRelguid()),
          (void 0 !== a && "" !== a) ||
            "undefined" == typeof Storage ||
            (a = localStorage.lastWedGUID),
          (e.guid = a),
          (t.LastWedGUID = a),
          e.tabSel("Alg"),
          e.loadWedstrijd();
        let r = "";
        "undefined" != typeof Storage &&
          (localStorage.setItem("lastWedGUID", a),
          "undefined" === (r = localStorage.pincode) && (r = "")),
          (e.wqM.pin = r);
      }),
      (e.tabSel = function (t) {
        e.tabSelected = t;
      }),
      (e.loadWedstrijd = function () {
        a.get(e.sportModuleBaseUrl + "/MatchByWedGuid?issguid=" + e.guid).then(
          function (a) {
            var i = a.data[0].doc;
            (e.basicTruncate = function (t, a = 37) {
              return (
                (e.truncStr = t.substring(0, a)),
                t.length > a ? e.truncStr + "..." : t
              );
            }),
              (e.truncTeamThuisNaam = e.basicTruncate(i.teamThuisNaam)),
              (e.truncTeamUitNaam = e.basicTruncate(i.teamUitNaam)),
              (e.ShowfullTeamName = function (t) {
                t.length >= 37 &&
                  (t === e.truncTeamThuisNaam &&
                    (e.truncTeamThuisNaam = i.teamThuisNaam),
                  t === e.truncTeamUitNaam &&
                    (e.truncTeamUitNaam = i.teamUitNaam));
              }),
              (e.ShowTruncTeamName = function (t) {
                t.length > 37 &&
                  (t === e.truncTeamThuisNaam &&
                    (e.truncTeamThuisNaam = e.basicTruncate(i.teamThuisNaam)),
                  t === e.truncTeamUitNaam &&
                    (e.truncTeamUitNaam = e.basicTruncate(i.teamUitNaam)));
              }),
              (t.teamThuisNaam = i.teamThuisNaam),
              (t.teamThuisGUID = i.teamThuisGUID),
              (t.wedID = i.wedID),
              (t.teamUitNaam = i.teamUitNaam),
              (t.teamUitGUID = i.teamUitGUID),
              (t.clubThuisGUID = t.teamThuisGUID.substring(0, 8)),
              (t.clubUitGUID = t.teamUitGUID.substring(0, 8)),
              (t.pouleGUID = i.pouleGUID),
              (t.dwfI4Speler = i.dwfI4Speler),
              (t.dwfPdf = ""),
              (t.dwfInfo = ""),
              (t.Scores = "123"),
              null != i.dwfI4Match &&
                ((t.dwfPdf = i.dwfI4Match.dwfPdf),
                (t.dwfInfo = i.dwfI4Match.dwfInfo),
                (t.Scores = i.dwfI4Match.scores)),
              (e.dwfPdfShowScore = !0),
              "U10" == e.dwfPdf && (e.dwfPdfShowScore = !1),
              (t.authorized4Match = t.chkIfAuthorized4Match(!0)),
              (t.verslagIsPublic = !1),
              (t.dwfVerslagMember = !1);
            var n = t.teamThuisGUID.substring(8, 11);
            (t.verslagIsPublic =
              t.authorized4Match || "HSE" == n || "DSE" == n),
              (t.datumString = i.datumString),
              (t.pouleNaam = i.pouleNaam),
              (e.beginTijd = i.beginTijd),
              (e.matchUitslag = i.uitslag),
              (e.matchUitslagT = 0),
              (e.matchUitslagU = 0),
              "" !== e.matchUitslag &&
                ((e.matchUitslagT = e.matchUitslag.substring(0, 3)),
                (e.matchUitslagU = e.matchUitslag.substring(4))),
              (e.matchjsDTCode = i.jsDTCode);
            var o = i.accommodatieDoc;
            e.accommOmschr = o.naam;
            var s = o.adres;
            if (
              ((e.accommnr = s.huisNr),
              (e.Accommstraat = s.straat),
              (e.AccommZipp = s.postcode),
              (e.AccommStad = s.plaats),
              (e.AccommLand = s.land),
              null == i.wedOff || 0 == i.wedOff.length)
            )
              (e.officString = ""), (e.showOfficial = !1);
            else {
              var u;
              (e.showOfficial = !0), (e.officString = "");
              var c = i.wedOff.length;
              for (u = 0; u < c; u++) e.officString += ", " + i.wedOff[u];
              e.officString = e.officString.substring(2);
            }
            if (
              ((e.dwfStatus = i.dwfStatus),
              (e.uitslagInvoerenDisabled = !0),
              (e.showbuttons = !1),
              e.matchUitslag.length > 0)
            )
              (e.uitslagBekend = !0), e.tabSel("DWF"), (e.showbuttons = !1);
            else {
              e.showbuttons = !0;
              var l = Date.now();
              (l += 1),
                e.DSTInEffect(new Date()) && (l += 36e5),
                l > e.matchjsDTCode &&
                  ((e.uitslagInvoerenDisabled = !1), e.tabSel("DWF"));
            }
            null === e.accommnr && (e.accommnr = "");
            var d =
              e.AccommZipp +
              "+" +
              e.AccommStad +
              "+" +
              e.Accommstraat +
              " " +
              e.accommnr +
              "+,+" +
              e.AccommLand;
            (e.url =
              "https://www.google.com/maps/embed/v1/place?q=" +
              d +
              "&key=AIzaSyAKvedS92uNSiu31byzY18gFOOSMyxuNFA"),
              (e.map = r.trustAsResourceUrl(e.url));
          }
        );
      }),
      (e.DSTInEffect = function (t) {
        let e = !1;
        return (
          t.getTimezoneOffset() !==
            new Date(t.getFullYear(), 0, 1).getTimezoneOffset() && (e = !0),
          e
        );
      }),
      (e.putUitslag = function () {
        if (
          "" === e.wqM.scorethuis ||
          "" === e.wqM.scoreuit ||
          "" === e.wqM.pin
        )
          return;
        "undefined" != typeof Storage &&
          localStorage.setItem("pincode", e.wqM.pin);
        const i =
          ("   " + e.wqM.scorethuis).slice(-3) +
          "-" +
          ("   " + e.wqM.scoreuit).slice(-3);
        (e.showbuttons = !1),
          a
            .get(
              e.sportModuleBaseUrl +
                "/UitslagByWedGuidCodeEnPin?issguid=" +
                e.guid +
                "&score=" +
                i +
                "&code1=" +
                e.wqM.pin +
                "&code2=" +
                t.teamThuisGUID +
                t.teamUitGUID
            )
            .then(function (t) {
              "ok" === t.data
                ? ((e.uitslagInvoerenDisabled = !0),
                  (e.matchUitslag = uitslag2Process),
                  n.wqAlert("Uitslag wordt verwerkt!"))
                : ((e.uitslagInvoerenDisabled = !1),
                  (e.showbuttons = !0),
                  n.wqAlert(
                    "Fout! Pincode onjuist of verwerking niet mogelijk!"
                  ));
            });
      }),
      (e.go2DWF = function (a) {
        if (t.chkIfAuthorized4Match()) {
          let t = !0;
          if ((e.dwfStatus, t)) {
            const a = Date.now(),
              i = a - 1728e5,
              r = a + 504e5;
            (e.matchjsDTCode > r || e.matchjsDTCode < i) && (t = !1);
          }
          if (!t) {
            n.wqAlert(
              "Wedstrijd niet beschikbaar (v.a. wedstrijddag t/m 5 dagen erna)"
            );
            const t = i.getRelguid();
            if ("BVBL57508" !== t && "BVBL185889" !== t && "BVBL183253" !== t)
              return;
          }
          let r = e.dwfUrl;
          "beta" == a && (r = e.dwfUrlBeta),
            (r += "/?guid=" + e.guid),
            (r += "&username=" + i.getUsername()),
            window.open(r);
        }
      }),
      (t.chkIfAuthorized4Match = function (e) {
        t.userRelGuid = "na";
        const a = null == e || !1 === e;
        if (!i.loggedIn())
          return (
            a &&
              n.wqAlert(
                "Inloggen is vereist om wijzigingen aan te brengen of naar DWF te gaan!"
              ),
            !1
          );
        t.userRelGuid = i.getRelguid();
        let r = i.getRelguid();
        if ("" === r || "na" === r)
          return a && n.wqAlert("Account niet gekoppeld aan lidnummer!"), !1;
        const o = i.getRollen(),
          s = o[0].Description,
          u = JSON.parse(s).curOrgGuids,
          c = u.length;
        var l = o.filter(function (t) {
          return "DwfVerslag" === t.AccountRolType;
        })[0];
        null != l && "DwfVerslag" === l.AccountRolType
          ? (t.dwfVerslagMember = !0)
          : (t.dwfVerslagMember = !1);
        let d = !1;
        for (let e = 0; e < c; e++) {
          const a = u[e];
          if (t.clubThuisGUID === a || t.clubUitGUID === a) {
            d = !0;
            break;
          }
        }
        if (!d) {
          if (t.dwfVerslagMember) return !0;
          a &&
            n.wqAlert(
              "Niet aangesloten bij thuis of uitclub van deze wedstrijd!"
            ),
            (r = i.getRelguid());
        }
        return !0;
      });
  },
]);

sportModule.filter("upComing", function () {
  return function (e, t) {
    if (e && e.length) {
      var a = Date.now();
      return (
        (a += 36e5),
        e.filter(function (e) {
          return 1 === t ? e.jsDTCode >= a : e.jsDTCode < a;
        })
      );
    }
  };
}),
  sportModule.service("scoreParseService", function () {
    this.parseScore = function (e, t, a) {
      var p = parseInt(e.substring(t, a));
      return isNaN(p) ? "-" : p;
    };
  }),
  sportModule.filter("tTScore", function (e) {
    return function (t) {
      return e.parseScore(t, 0, 3);
    };
  }),
  sportModule.filter("tUScore", function (e) {
    return function (t) {
      return e.parseScore(t, 4, 7);
    };
  }),
  sportModule.controller("PouleDetailController", [
    "$rootScope",
    "$scope",
    "$http",
    "$window",
    "scoreParseService",
    "WQData",
    "wqGlobal",
    function (e, t, a, p, n, l, o) {
      function i() {
        var e = "thuis";
        if (!1 !== t.calcStatsNeeded) {
          t.calcStatsNeeded = !1;
          var a = {};
          for (var p in (t.matches.sort(function (e, t) {
            return e.jsDTCode - t.jsDTCode;
          }),
          t.matches.forEach(function (t) {
            var p = new Date(t.jsDTCode);
            p.setHours(p.getHours() - 2);
            var l = new Date();
            if (!(null == t.uitslag || p.getTime() > l.getTime())) {
              var o = n.parseScore(t.uitslag, 0, 3),
                i = n.parseScore(t.uitslag, 4, 7);
              if (!(isNaN(o) || isNaN(i) || (0 === o && 0 === i))) {
                var s = {},
                  d = [e, "uit"];
                for (var r in (d.forEach(function (p) {
                  var n = p == e ? t.tTGUID : t.tUGUID;
                  if (((s[p] = a[n]), null == s[p])) {
                    var l = p == e ? t.tTNaam : t.tUNaam;
                    (a[n] = new (function (e, t) {
                      (this.teamGUID = e),
                        (this.teamNaam = t),
                        (this.puntenTegen = 0),
                        (this.puntenVoor = 0),
                        (this.gespeeldeThuisMatches = 0),
                        (this.gespeeldeUitMatches = 0),
                        (this.gewonnenThuisMatches = 0),
                        (this.gewonnenUitMatches = 0),
                        (this.gewonnenCloseCalls = 0),
                        (this.gewonnenMatches = 0),
                        (this.verlorenMatches = 0),
                        (this.gelijkGespeeldeMatches = 0),
                        (this.winningStreak = 0),
                        (this.winningStreakCounter = 0);
                    })(n, l)),
                      (s[p] = a[n]);
                  }
                }),
                s)) {
                  var u = s[r];
                  (u.puntenTegen += r == e ? i : o),
                    (u.puntenVoor += r == e ? o : i),
                    r == e
                      ? u.gespeeldeThuisMatches++
                      : u.gespeeldeUitMatches++;
                  var g = r == e ? "uit" : e;
                  (r == e ? o > i : i > o)
                    ? (r == e
                        ? u.gewonnenThuisMatches++
                        : u.gewonnenUitMatches++,
                      Math.abs(o - i) < 5 && u.gewonnenCloseCalls++,
                      u.winningStreakCounter++,
                      u.winningStreakCounter > u.winningStreak &&
                        (u.winningStreak = u.winningStreakCounter),
                      s[g].winningStreakCounter > s[g].winningStreak &&
                        (s[g].winningStreak = s[g].winningStreakCounter),
                      (s[g].winningStreakCounter = 0),
                      s[g].verlorenMatches++)
                    : (u.winningStreakCounter > u.winningStreak &&
                        (u.winningStreak = u.winningStreakCounter),
                      (u.winningStreakCounter = 0));
                }
              }
            }
          }),
          a)) {
            var l = a[p];
            (l.gewonnenMatches = l.gewonnenThuisMatches + l.gewonnenUitMatches),
              (l.gelijkGespeeldeMatches =
                l.gespeeldeThuisMatches +
                l.gespeeldeUitMatches -
                (l.gewonnenMatches + l.verlorenMatches)),
              t.teamStatistics.push(l);
          }
          t.teamStatistics.forEach(function (e) {
            var t = e.gespeeldeThuisMatches + e.gespeeldeUitMatches;
            (e.puntenTegen /= t),
              (e.puntenVoor /= t),
              (e.gewonnenThuisMatches /= e.gespeeldeThuisMatches / 100),
              (e.gewonnenUitMatches /= e.gespeeldeUitMatches / 100);
          });
        }
      }
      (t.sportModuleBaseUrl = e.sportModuleBaseUrl),
        (t.sportModuleClubLogoUrlPrefix = e.sportModuleClubLogoUrlPrefix),
        (t.selTab = "A"),
        (t.init = function (n) {
          (t.guid = n),
            (t.currPouleIsBekerFinale = t.isBekerFinale(t.guid)),
            (t.isPoules = !1),
            (t.isVoorrondes = !1),
            (t.loadWedsNeeded = !0),
            (t.dataStatPlayers = null),
            (t.dataStatTeams = null),
            (t.loadStatPlayerDone = !1),
            (t.loadStatTeamDone = !1),
            (t.isMetRelatedPoules = !1),
            (t.MetPlayOffLink = !1),
            null == e.showRelatedPoules &&
              (e.showRelatedPoules = t.currPouleIsBekerFinale),
            ("BVBL16179180NAHSEP4" !== n &&
              "BVBL16179180NAHSEP2" !== n &&
              "BVBL16179180NAHSEP1" !== n &&
              "BVBL16179180NADSEP4" !== n &&
              "BVBL16179180NADSEP2" !== n &&
              "BVBL16179180NADSEP1" !== n &&
              "BVBL16179180OEFENNAw" !== n) ||
              (t.MetPlayOffLink = !0),
            a
              .get(t.sportModuleBaseUrl + "/pouleByGuid?pouleguid=" + t.guid)
              .success(function (e) {
                if (0 === e.length)
                  return (
                    o.wqAlert("Reeks niet gevonden.!"),
                    void (p.location.href = "/Home/Competities")
                  );
                var a;
                t.poule = e;
                try {
                  a = e[0];
                } catch (e) {}
                if (
                  ((t.PouleNaam = a.naam),
                  (t.teams = a.teams),
                  null != a.relatedPoules)
                ) {
                  var n = 1;
                  (t.gridNumberOfColumns = a.relatedPoules.length),
                    a.relatedPoules.forEach(function (e) {
                      e.korteNaam.length > n && (n = e.korteNaam.length);
                    }),
                    n > 12
                      ? (t.gridNumberOfColumns = 6)
                      : n > 8
                      ? (t.gridNumberOfColumns = 10)
                      : n >= 1 && (t.gridNumberOfColumns = 20),
                    (t.isMetRelatedPoules = !0);
                }
                (t.relatedPoules = a.relatedPoules),
                  (t.currPouleIsBekerFinale ||
                    "B" == t.selTab ||
                    "C" == t.selTab) &&
                    ((t.loadWedsNeeded = !0), t.loadWeds()),
                  (t.calcStatsNeeded = !0),
                  (t.teamStatistics = []),
                  "D" == t.selTab && t.calcStats();
              });
        }),
        (t.SelPoule = function (e) {
          t.init(e);
        }),
        (t.isBekerFinale = function (e) {
          var t = e.substring(e.length - 2, e.length),
            a = "B" == e.substring(12, 13),
            p = !isNaN(parseInt(t));
          return a && p;
        }),
        (t.selectTab = function (e) {
          t.selTab = e;
        }),
        (t.setActiveSection = function (e) {
          return "";
        }),
        (t.loadBekerPoule = function (e, a) {
          var p = t.relatedPoules[e];
          (t.PouleNaam = p.naam),
            (t.guid = p.guid),
            (t.query = a),
            (t.loadWedsNeeded = !0),
            t.loadWeds();
        }),
        (t.redirectPoule = function (e, a) {
          if (0 == a.indexOf("winnaar")) {
            var n,
              l = a.split(" "),
              o = t.relatedPoules.length;
            for (
              n = 0;
              n < o && !(t.relatedPoules[n].guid.indexOf(l[1]) > 0);
              n++
            );
            t.loadBekerPoule(n, l[1] + l[2]);
          } else p.location.href = "/Home/TeamDetail?teamguid=" + e;
        }),
        (t.loadWeds = function (e) {
          !1 !== t.loadWedsNeeded &&
            a
              .get(
                t.sportModuleBaseUrl + "/PouleMatchesByGuid?issguid=" + t.guid
              )
              .success(function (a) {
                t.matches = a;
                var p = Date.now();
                (p -= 36e5),
                  t.matches.forEach(function (e) {
                    (e.clubThuisGUID = e.tTGUID.substring(0, 8)),
                      (e.clubUitGUID = e.tUGUID.substring(0, 8)),
                      e.jsDTCode > p &&
                        e.uitslag.indexOf("FOR") > 0 &&
                        (e.beginTijd = "Let op!! Forfait."),
                      t.currPouleIsBekerFinale &&
                        (null != e.uitslag
                          ? ((e.tScore = n.parseScore(e.uitslag, 0, 3)),
                            (e.uScore = n.parseScore(e.uitslag, 4, 7)))
                          : ((e.tScore = "-"), (e.uScore = "-")));
                  }),
                  (t.loadWedsNeeded = !1),
                  !0 === e &&
                    ((t.calcStatsNeeded = !0), t.isBekerFinale(t.guid) || i());
              });
        }),
        (t.calcStats = function () {
          !0 === t.loadWedsNeeded && t.loadWeds(!0),
            t.isBekerFinale(t.guid) || i();
        }),
        (t.setQuery = function (e) {
          p.location.href =
            "/Home/Competities?Query=" +
            t.guid.substring(0, t.guid.length - 2) +
            e;
        }),
        (t.toggleRelPoules = function () {
          e.showRelatedPoules = !e.showRelatedPoules;
        }),
        (t.goToStats = function (e) {
          if (!l.loggedIn())
            return (
              o.wqAlert("Inloggen is vereist om naar statistieken te gaan!"), !1
            );
          t.username = l.getUsername();
          var a =
            "https://vblstats.wisseq.eu/login/" + t.username + "/" + t.guid;
          window.open(a, "_blank");
        }),
        (t.addToFavorites = function () {
          l.addToFavorites(t.guid, t.PouleNaam, "103");
        }),
        (t.isInFavorites = function () {
          return l.isInFavorites(t.guid);
        }),
        (t.date = new Date()),
        (t.PouleNaam = "Top division"),
        (t.categorie = ["Men 1", " Men 2", "Women 1"]),
        (t.regioos = { regio: "Nationaal", cat: "Men 1" }),
        (t.pouleGUID = "BVBL19209180NAHSE11A"),
        (t.playerStatisticsLastRoundHigh = [
          {
            relGuid: "BVBL202727",
            playerNaam: " Alexander Schepens ",
            age: 25,
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 44,
            ptTot: 45,
            ptfield: 20,
            ptfieldpercentage: 45,
            pt3: 5,
            pt3percentage: 10,
            persenalfaults: 10,
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Melco Ieper HSE A",
            pt1: 14,
            pt2: 2,
            ptFree: 3,
          },
          {
            relGuid: "BVBL202727",
            playerNaam: "Jan2",
            age: 26,
            wedplayed: 1,
            wins: 0,
            lost: 1,
            minplayed: 44,
            ptTot: 20,
            ptfield: 20,
            ptfieldpercentage: 100,
            pt3: 0,
            pt3percentage: 0,
            persenalfaults: 20,
            teamNaam: "testteam",
            pt1: 15,
            pt2: 2,
            ptFree: 3,
          },
          {
            relGuid: "BVBL202727",
            playerNaam: "Jan",
            age: 19,
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 44,
            ptTot: 45,
            ptfield: 20,
            ptfieldpercentage: 45,
            pt3: 5,
            pt3percentage: 10,
            persenalfaults: 10,
            teamNaam: "testteam",
          },
          {
            relGuid: "BVBL202727",
            playerNaam: "piet",
            age: 17,
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 44,
            ptTot: 45,
            ptfield: 40,
            ptfieldpercentage: 45,
            pt3: 5,
            pt3percentage: 10,
            persenalfaults: 6,
            teamNaam: "testteam",
            pt1: 17,
            pt2: 2,
          },
          {
            relGuid: "BVBL202727",
            playerNaam: "Rafael Bogaerts",
            age: 23,
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 44,
            ptTot: 19,
            ptfield: 40,
            ptfieldpercentage: 45,
            pt3: 5,
            pt3percentage: 10,
            persenalfaults: 6,
            teamNaam: "Gembo Borgerhout HSE A",
            pt1: 20,
            pt2: 2,
          },
          {
            relGuid: "BVBL202727",
            playerNaam: "Laurens Van den Hemel",
            age: 30,
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 44,
            ptTot: 22,
            ptfield: 40,
            ptfieldpercentage: 45,
            pt3: 5,
            pt3percentage: 10,
            persenalfaults: 6,
            teamNaam: "Gembo Borgerhout HSE A",
            pt1: 21,
            pt2: 2,
          },
          {
            relGuid: "BVBL202727",
            playerNaam: "Aaron Van Vooren",
            age: 32,
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 44,
            ptTot: 40,
            ptfield: 40,
            ptfieldpercentage: 45,
            pt3: 5,
            pt3percentage: 10,
            persenalfaults: 6,
            teamNaam: "Koninklijk Basket Team ION Waregem HSE A ",
            pt1: 22,
            pt2: 2,
          },
          {
            relGuid: "BVBL202727",
            playerNaam: "Thomas Mertens",
            age: 21,
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 44,
            ptTot: 23,
            ptfield: 40,
            ptfieldpercentage: 45,
            pt3: 5,
            pt3percentage: 10,
            persenalfaults: 6,
            teamNaam: "testteam",
            pt1: 23,
            pt2: 14,
          },
        ]),
        (t.playerSeizoenStatistics = [
          {
            relGuid: "BVBL202727",
            playerNaam: " Alexander Schepens ",
            age: 25,
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 44,
            ptTot: 45,
            ptfield: 20,
            ptfieldpercentage: 45,
            pt3: 5,
            pt3percentage: 10,
            persenalfaults: 10,
            pouleguid: "BVBL19209180NAHSE11A",
            poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Melco Ieper HSE A",
            pt1: 14,
            pt2: 2,
            ptFree: 3,
          },
          {
            relGuid: "BVBL202727",
            playerNaam: "Jan2",
            age: 26,
            wedplayed: 1,
            wins: 0,
            lost: 1,
            minplayed: 44,
            ptTot: 20,
            ptfield: 20,
            ptfieldpercentage: 100,
            pt3: 0,
            pt3percentage: 0,
            persenalfaults: 20,
            teamNaam: "testteam",
            pt1: 15,
            pt2: 2,
            ptFree: 3,
          },
          {
            relGuid: "BVBL202727",
            playerNaam: "Jan",
            age: 19,
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 44,
            ptTot: 45,
            ptfield: 20,
            ptfieldpercentage: 45,
            pt3: 5,
            pt3percentage: 10,
            persenalfaults: 10,
            teamNaam: "testteam",
          },
          {
            relGuid: "BVBL202727",
            playerNaam: "piet",
            age: 17,
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 44,
            ptTot: 45,
            ptfield: 40,
            ptfieldpercentage: 45,
            pt3: 5,
            pt3percentage: 10,
            persenalfaults: 6,
            teamNaam: "testteam",
            pt1: 17,
            pt2: 2,
          },
          {
            relGuid: "BVBL202727",
            playerNaam: "Rafael Bogaerts",
            age: 23,
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 44,
            ptTot: 19,
            ptfield: 40,
            ptfieldpercentage: 45,
            pt3: 5,
            pt3percentage: 10,
            persenalfaults: 6,
            teamNaam: "Gembo Borgerhout HSE A",
            pt1: 20,
            pt2: 2,
          },
          {
            relGuid: "BVBL202727",
            playerNaam: "Laurens Van den Hemel",
            age: 30,
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 44,
            ptTot: 22,
            ptfield: 40,
            ptfieldpercentage: 45,
            pt3: 5,
            pt3percentage: 10,
            persenalfaults: 6,
            teamNaam: "Gembo Borgerhout HSE A",
            pt1: 21,
            pt2: 2,
          },
          {
            relGuid: "BVBL202727",
            playerNaam: "Aaron Van Vooren",
            age: 32,
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 44,
            ptTot: 40,
            ptfield: 40,
            ptfieldpercentage: 45,
            pt3: 5,
            pt3percentage: 10,
            persenalfaults: 6,
            teamNaam: "Koninklijk Basket Team ION Waregem HSE A ",
            pt1: 22,
            pt2: 2,
          },
          {
            relGuid: "BVBL202727",
            playerNaam: "Thomas Mertens",
            age: 21,
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 44,
            ptTot: 23,
            ptfield: 40,
            ptfieldpercentage: 45,
            pt3: 5,
            pt3percentage: 10,
            persenalfaults: 6,
            teamNaam: "testteam",
            pt1: 23,
            pt2: 14,
          },
        ]),
        (t.TeamsLastRoundStatistics = [
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Melco Ieper HSE ",
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 80,
            ptTot: 96,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Wanty Gent Hawks ",
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 80,
            ptTot: 92,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Gembo Borgerhout ",
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 80,
            ptTot: 73,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Koninklijk Basket Team ION Waregem ",
            wedplayed: 1,
            wins: 0,
            lost: 1,
            minplayed: 80,
            ptTot: 88,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Remant Basics Melsele-Beveren HSE A",
            wedplayed: 1,
            wins: 0,
            lost: 1,
            minplayed: 80,
            ptTot: 95,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "  BC Guco Lier Vzw HSE A",
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 80,
            ptTot: 87,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: " Oxaco BBC Boechout HSE A",
            wedplayed: 1,
            wins: 0,
            lost: 1,
            minplayed: 80,
            ptTot: 78,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: " BBC Croonen Lommel HSE A",
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 80,
            ptTot: 109,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "LDP Donza HSE A",
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 80,
            ptTot: 75,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Hubo Limburg United HSE B",
            wedplayed: 1,
            wins: 0,
            lost: 1,
            minplayed: 80,
            ptTot: 71,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Spirou Basket HSE B",
            wedplayed: 1,
            wins: 0,
            lost: 1,
            minplayed: 80,
            ptTot: 59,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Royal IV Brussel HSE A",
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 80,
            ptTot: 75,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: " Basket Sijsele HSE A",
            wedplayed: 1,
            wins: 0,
            lost: 1,
            minplayed: 80,
            ptTot: 87,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Kon BC Gistel Oostende Duva Fruit HSE A",
            wedplayed: 1,
            wins: 0,
            lost: 1,
            minplayed: 80,
            ptTot: 47,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
        ]),
        (t.teamSeizoenStatistics = [
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Melco Ieper HSE ",
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 80,
            ptTot: 196,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Wanty Gent Hawks ",
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 80,
            ptTot: 92,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Gembo Borgerhout ",
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 80,
            ptTot: 73,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Koninklijk Basket Team ION Waregem ",
            wedplayed: 1,
            wins: 0,
            lost: 1,
            minplayed: 80,
            ptTot: 88,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Remant Basics Melsele-Beveren HSE A",
            wedplayed: 1,
            wins: 0,
            lost: 1,
            minplayed: 80,
            ptTot: 95,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "  BC Guco Lier Vzw HSE A",
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 80,
            ptTot: 87,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: " Oxaco BBC Boechout HSE A",
            wedplayed: 1,
            wins: 0,
            lost: 1,
            minplayed: 80,
            ptTot: 78,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: " BBC Croonen Lommel HSE A",
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 80,
            ptTot: 109,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "LDP Donza HSE A",
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 80,
            ptTot: 75,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Hubo Limburg United HSE B",
            wedplayed: 1,
            wins: 0,
            lost: 1,
            minplayed: 80,
            ptTot: 71,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Spirou Basket HSE B",
            wedplayed: 1,
            wins: 0,
            lost: 1,
            minplayed: 80,
            ptTot: 59,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Royal IV Brussel HSE A",
            wedplayed: 1,
            wins: 1,
            lost: 0,
            minplayed: 80,
            ptTot: 75,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: " Basket Sijsele HSE A",
            wedplayed: 1,
            wins: 0,
            lost: 1,
            minplayed: 80,
            ptTot: 87,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
          {
            pouleguid: "pg1",
            Poulenaam: "topdivision men",
            teamguid: "tg1",
            teamNaam: "Kon BC Gistel Oostende Duva Fruit HSE A",
            wedplayed: 1,
            wins: 0,
            lost: 1,
            minplayed: 80,
            ptTot: 47,
            ptveld: 14,
            ptveldpercentage: 2,
            pt3: 3,
            pt3percentage: 4,
            PersonalFouls: 5,
          },
        ]),
        (t.SwitchPlayersTeams = function (e, a) {
          (t.column = a),
            "allplayersLastRound" == e &&
              (t.playersLastRoundStatistics = [
                {
                  relGuid: "BVBL202727",
                  playerNaam: " Alexander Schepens ",
                  age: 25,
                  wedplayed: 1,
                  wins: 1,
                  lost: 0,
                  minplayed: 44,
                  ptTot: 45,
                  ptfield: 20,
                  ptfieldpercentage: 45,
                  pt3: 5,
                  pt3percentage: 10,
                  persenalfaults: 10,
                  pouleguid: "pg1",
                  Poulenaam: "topdivision men",
                  teamguid: "tg1",
                  teamNaam: "Melco Ieper HSE A",
                  pt1: 14,
                  pt2: 2,
                  ptFree: 3,
                },
                {
                  relGuid: "BVBL202727",
                  playerNaam: "Jan2",
                  age: 26,
                  wedplayed: 1,
                  wins: 0,
                  lost: 1,
                  minplayed: 44,
                  ptTot: 20,
                  ptfield: 20,
                  ptfieldpercentage: 100,
                  pt3: 0,
                  pt3percentage: 0,
                  persenalfaults: 20,
                  teamNaam: "testteam",
                  pt1: 15,
                  pt2: 2,
                  ptFree: 3,
                },
                {
                  relGuid: "BVBL202727",
                  playerNaam: "Jan",
                  age: 19,
                  wedplayed: 1,
                  wins: 1,
                  lost: 0,
                  minplayed: 44,
                  ptTot: 45,
                  ptfield: 20,
                  ptfieldpercentage: 45,
                  pt3: 5,
                  pt3percentage: 10,
                  persenalfaults: 10,
                  teamNaam: "testteam",
                },
                {
                  relGuid: "BVBL202727",
                  playerNaam: "piet",
                  age: 17,
                  wedplayed: 1,
                  wins: 1,
                  lost: 0,
                  minplayed: 44,
                  ptTot: 45,
                  ptfield: 40,
                  ptfieldpercentage: 45,
                  pt3: 5,
                  pt3percentage: 10,
                  persenalfaults: 6,
                  teamNaam: "testteam",
                  pt1: 17,
                  pt2: 2,
                },
                {
                  relGuid: "BVBL202727",
                  playerNaam: "Rafael Bogaerts",
                  age: 23,
                  wedplayed: 1,
                  wins: 1,
                  lost: 0,
                  minplayed: 44,
                  ptTot: 19,
                  ptfield: 40,
                  ptfieldpercentage: 45,
                  pt3: 5,
                  pt3percentage: 10,
                  persenalfaults: 6,
                  teamNaam: "Gembo Borgerhout HSE A",
                  pt1: 20,
                  pt2: 2,
                },
                {
                  relGuid: "BVBL202727",
                  playerNaam: "Laurens Van den Hemel",
                  age: 30,
                  wedplayed: 1,
                  wins: 1,
                  lost: 0,
                  minplayed: 44,
                  ptTot: 22,
                  ptfield: 40,
                  ptfieldpercentage: 45,
                  pt3: 5,
                  pt3percentage: 10,
                  persenalfaults: 6,
                  teamNaam: "Gembo Borgerhout HSE A",
                  pt1: 21,
                  pt2: 2,
                },
                {
                  relGuid: "BVBL202727",
                  playerNaam: "Aaron Van Vooren",
                  age: 32,
                  wedplayed: 1,
                  wins: 1,
                  lost: 0,
                  minplayed: 44,
                  ptTot: 40,
                  ptfield: 40,
                  ptfieldpercentage: 45,
                  pt3: 5,
                  pt3percentage: 10,
                  persenalfaults: 6,
                  teamNaam: "Koninklijk Basket Team ION Waregem HSE A ",
                  pt1: 22,
                  pt2: 2,
                },
                {
                  relGuid: "BVBL202727",
                  playerNaam: "Thomas Mertens",
                  age: 21,
                  wedplayed: 1,
                  wins: 1,
                  lost: 0,
                  minplayed: 44,
                  ptTot: 23,
                  ptfield: 40,
                  ptfieldpercentage: 45,
                  pt3: 5,
                  pt3percentage: 10,
                  persenalfaults: 6,
                  teamNaam: "testteam",
                  pt1: 23,
                  pt2: 14,
                },
              ]),
            "allteamsLastRound" == e &&
              (t.TeamsLastRoundStatistics = [
                {
                  pouleguid: "pg1",
                  Poulenaam: "topdivision men",
                  teamguid: "tg1",
                  teamNaam: "Melco Ieper HSE ",
                  wedplayed: 1,
                  wins: 1,
                  lost: 0,
                  minplayed: 80,
                  ptTot: 96,
                  ptveld: 14,
                  ptveldpercentage: 2,
                  pt3: 3,
                  pt3percentage: 4,
                  PersonalFouls: 5,
                },
                {
                  pouleguid: "pg1",
                  Poulenaam: "topdivision men",
                  teamguid: "tg1",
                  teamNaam: "Wanty Gent Hawks ",
                  wedplayed: 1,
                  wins: 1,
                  lost: 0,
                  minplayed: 80,
                  ptTot: 92,
                  ptveld: 14,
                  ptveldpercentage: 2,
                  pt3: 3,
                  pt3percentage: 4,
                  PersonalFouls: 5,
                },
                {
                  pouleguid: "pg1",
                  Poulenaam: "topdivision men",
                  teamguid: "tg1",
                  teamNaam: "Gembo Borgerhout ",
                  wedplayed: 1,
                  wins: 1,
                  lost: 0,
                  minplayed: 80,
                  ptTot: 73,
                  ptveld: 14,
                  ptveldpercentage: 2,
                  pt3: 3,
                  pt3percentage: 4,
                  PersonalFouls: 5,
                },
                {
                  pouleguid: "pg1",
                  Poulenaam: "topdivision men",
                  teamguid: "tg1",
                  teamNaam: "Koninklijk Basket Team ION Waregem ",
                  wedplayed: 1,
                  wins: 0,
                  lost: 1,
                  minplayed: 80,
                  ptTot: 88,
                  ptveld: 14,
                  ptveldpercentage: 2,
                  pt3: 3,
                  pt3percentage: 4,
                  PersonalFouls: 5,
                },
                {
                  pouleguid: "pg1",
                  Poulenaam: "topdivision men",
                  teamguid: "tg1",
                  teamNaam: "Remant Basics Melsele-Beveren HSE A",
                  wedplayed: 1,
                  wins: 0,
                  lost: 1,
                  minplayed: 80,
                  ptTot: 95,
                  ptveld: 14,
                  ptveldpercentage: 2,
                  pt3: 3,
                  pt3percentage: 4,
                  PersonalFouls: 5,
                },
                {
                  pouleguid: "pg1",
                  Poulenaam: "topdivision men",
                  teamguid: "tg1",
                  teamNaam: "  BC Guco Lier Vzw HSE A",
                  wedplayed: 1,
                  wins: 1,
                  lost: 0,
                  minplayed: 80,
                  ptTot: 87,
                  ptveld: 14,
                  ptveldpercentage: 2,
                  pt3: 3,
                  pt3percentage: 4,
                  PersonalFouls: 5,
                },
                {
                  pouleguid: "pg1",
                  Poulenaam: "topdivision men",
                  teamguid: "tg1",
                  teamNaam: " Oxaco BBC Boechout HSE A",
                  wedplayed: 1,
                  wins: 0,
                  lost: 1,
                  minplayed: 80,
                  ptTot: 78,
                  ptveld: 14,
                  ptveldpercentage: 2,
                  pt3: 3,
                  pt3percentage: 4,
                  PersonalFouls: 5,
                },
                {
                  pouleguid: "pg1",
                  Poulenaam: "topdivision men",
                  teamguid: "tg1",
                  teamNaam: " BBC Croonen Lommel HSE A",
                  wedplayed: 1,
                  wins: 1,
                  lost: 0,
                  minplayed: 80,
                  ptTot: 109,
                  ptveld: 14,
                  ptveldpercentage: 2,
                  pt3: 3,
                  pt3percentage: 4,
                  PersonalFouls: 5,
                },
                {
                  pouleguid: "pg1",
                  Poulenaam: "topdivision men",
                  teamguid: "tg1",
                  teamNaam: "LDP Donza HSE A",
                  wedplayed: 1,
                  wins: 1,
                  lost: 0,
                  minplayed: 80,
                  ptTot: 75,
                  ptveld: 14,
                  ptveldpercentage: 2,
                  pt3: 3,
                  pt3percentage: 4,
                  PersonalFouls: 5,
                },
                {
                  pouleguid: "pg1",
                  Poulenaam: "topdivision men",
                  teamguid: "tg1",
                  teamNaam: "Hubo Limburg United HSE B",
                  wedplayed: 1,
                  wins: 0,
                  lost: 1,
                  minplayed: 80,
                  ptTot: 71,
                  ptveld: 14,
                  ptveldpercentage: 2,
                  pt3: 3,
                  pt3percentage: 4,
                  PersonalFouls: 5,
                },
                {
                  pouleguid: "pg1",
                  Poulenaam: "topdivision men",
                  teamguid: "tg1",
                  teamNaam: "Spirou Basket HSE B",
                  wedplayed: 1,
                  wins: 0,
                  lost: 1,
                  minplayed: 80,
                  ptTot: 59,
                  ptveld: 14,
                  ptveldpercentage: 2,
                  pt3: 3,
                  pt3percentage: 4,
                  PersonalFouls: 5,
                },
                {
                  pouleguid: "pg1",
                  Poulenaam: "topdivision men",
                  teamguid: "tg1",
                  teamNaam: "Royal IV Brussel HSE A",
                  wedplayed: 1,
                  wins: 1,
                  lost: 0,
                  minplayed: 80,
                  ptTot: 75,
                  ptveld: 14,
                  ptveldpercentage: 2,
                  pt3: 3,
                  pt3percentage: 4,
                  PersonalFouls: 5,
                },
                {
                  pouleguid: "pg1",
                  Poulenaam: "topdivision men",
                  teamguid: "tg1",
                  teamNaam: " Basket Sijsele HSE A",
                  wedplayed: 1,
                  wins: 0,
                  lost: 1,
                  minplayed: 80,
                  ptTot: 87,
                  ptveld: 14,
                  ptveldpercentage: 2,
                  pt3: 3,
                  pt3percentage: 4,
                  PersonalFouls: 5,
                },
                {
                  pouleguid: "pg1",
                  Poulenaam: "topdivision men",
                  teamguid: "tg1",
                  teamNaam: "Kon BC Gistel Oostende Duva Fruit HSE A",
                  wedplayed: 1,
                  wins: 0,
                  lost: 1,
                  minplayed: 80,
                  ptTot: 47,
                  ptveld: 14,
                  ptveldpercentage: 2,
                  pt3: 3,
                  pt3percentage: 4,
                  PersonalFouls: 5,
                },
              ]);
        }),
        (t.reverse = !1),
        (t.column = "ptTot"),
        (t.reverseclass = "arrow-down"),
        (t.reverse = !0),
        (t.sortColumn = function (e) {
          t.column != e && (t.reverse = !1),
            (t.column = e),
            t.reverse
              ? ((t.reverse = !1),
                (t.column = e),
                (t.reverseclass = "arrow-up"))
              : ((t.reverse = !0),
                (t.column = e),
                (t.reverseclass = "arrow-down"));
        }),
        (t.sortClass = function (e) {
          return t.column == e ? (t.reverse ? "arrow-down" : "arrow-up") : "";
        }),
        (t.test = function () {});
    },
  ]);

sportModule.controller("RelatieDetailController", [
  "$rootScope",
  "$scope",
  "$http",
  "wqGlobal",
  "WQData",
  function (e, t, r, a, n) {
    (t.sportModuleBaseUrl = e.sportModuleBaseUrl),
      (t.sportModuleClubLogoUrlPrefix = e.sportModuleClubLogoUrlPrefix),
      (t.init = function (e) {
        if (((t.guid = e), "" != t.guid)) {
          var r = { RelGUID: t.guid };
          t.relationXhrService("GetRel", r);
        }
      }),
      (t.transformRelCat = function (e) {
        var t = 0,
          r = [];
        return (
          e.forEach(function (e, a) {
            "BVBLSL" == e.catGuid
              ? ((e.catGuid = "Spelend lid"), (r[t++] = e))
              : "BVBLCO" == e.catGuid
              ? ((e.catGuid = "Coach"), a || (r[t++] = e))
              : "BVBLAL" == e.catGuid
              ? ((e.catGuid = "Administratief lid"), (r[t++] = e))
              : "BVBLIN" == e.catGuid && ((e.catGuid = "-"), a || (r[t++] = e));
          }),
          (e = r),
          r
        );
      }),
      (t.goToStats = function (e) {
        if (!n.loggedIn())
          return (
            a.wqAlert("Inloggen is vereist om naar statistieken te gaan!"), !1
          );
        t.username = n.getUsername();
        var r = "https://vblstats.wisseq.eu/login/" + t.username + "/" + t.guid;
        window.open(r, "_blank");
      }),
      (t.relationXhrService = function (e, r, o) {
        try {
          var i = null,
            s = new XMLHttpRequest();
          s.addEventListener("readystatechange", function () {
            if (4 === this.readyState)
              if (200 == this.status) {
                t.ResponseText = this.responseText;
                var r = JSON.parse(this.responseText);
                "GetRel" == e &&
                  ((null != t.ResponseText && null != t.ResponseText) ||
                    (a.wqAlert("Lid niet gevonden!"),
                    ($window.location.href = "/Home/Zoeken")),
                  (t.relation = r),
                  (t.spelersNaam = t.relation.Vnaam + " " + t.relation.Anaam),
                  (t.spelersLidnr = t.relation.LidNr),
                  (t.spelersGeslacht = t.relation.MVO),
                  (t.spelersGebDat = t.relation.sGebDat),
                  (t.relation.lms = t.transformRelCat(t.relation.lms, !0)),
                  t.transformRelCat(t.relation.lmsHistorie, !1)),
                  t.$apply();
              } else 0 == this.status || t.guid.startsWith("test");
          });
          var l = t.sportModuleBaseUrl;
          "GetRel" == e &&
            ((l += "/RelByRelGuid"),
            (null != r && null != r) || (r = {}),
            (r.AuthHeader = n.getAutheader()),
            (r.WQVer = t.currentversion),
            (r.CRUD = "R"),
            (i = JSON.stringify(r))),
            s.open("PUT", l, !0),
            (t.totAutho = n.getAutheader()),
            s.setRequestHeader("authorization", t.totAutho),
            s.setRequestHeader(
              "Content-type",
              "application/json; charset=utf-8"
            ),
            s.send(i);
        } catch (e) {}
      });
  },
]);
