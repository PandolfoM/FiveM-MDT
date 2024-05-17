local QBCore = exports['qb-core']:GetCoreObject()

QBCore.Functions.CreateCallback('ecrp-mdt:server:CreateProfile', function(source, cb, data)
  local player = MySQL.query.await('SELECT name FROM players WHERE citizenid = ?', { data.cid })
  if player[1] ~= nil then
    if data.pfp ~= "" then
      MySQL.insert('INSERT INTO ecrp_mdt_profiles (citizenid, name, pfp) VALUES (?, ?, ?)',
        { data.cid, data.name, data.pfp })
    else
      MySQL.insert('INSERT INTO ecrp_mdt_profiles (citizenid, name) VALUES (?, ?)',
        { data.cid, data.name })
    end

    cb(true)
  end
  cb(nil)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:CreateReport', function(source, cb, data)
  local player = QBCore.Functions.GetPlayer(source)
  if player ~= nil then
    MySQL.insert('INSERT INTO ecrp_mdt_reports (title, category, author) VALUES (?, ?, ?)',
      { data.title, data.category, player.PlayerData.charinfo.firstname .. " " .. player.PlayerData.charinfo.lastname })

    local newrow = MySQL.query.await("SELECT id FROM ecrp_mdt_reports ORDER BY id DESC LIMIT 1")
    if newrow[1] ~= nil then
      -- Calculate the new reportid based on the retrieved ID
      local newReportId = tonumber(newrow[1].id) + 999

      -- Update the latest inserted row with the new reportid
      MySQL.Sync.execute('UPDATE ecrp_mdt_reports SET reportid = ? WHERE id = ?',
        { newReportId, newrow[1].id })

      -- Return the updated row with the new reportid to the client
      cb(newReportId)
      return
    end
  end
  cb(nil)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:CreateIncident', function(source, cb, data)
  local player = QBCore.Functions.GetPlayer(source)
  if player ~= nil then
    MySQL.insert('INSERT INTO ecrp_mdt_incidents (title, author) VALUES (?, ?)',
      { data.title, player.PlayerData.citizenid })

    local newrow = MySQL.query.await("SELECT id FROM ecrp_mdt_incidents ORDER BY id DESC LIMIT 1")
    if newrow[1] ~= nil then
      -- Calculate the new reportid based on the retrieved ID
      local newIncidentId = tonumber(newrow[1].id) + 999

      -- Update the latest inserted row with the new reportid
      MySQL.Sync.execute('UPDATE ecrp_mdt_incidents SET incidentid = ? WHERE id = ?',
        { newIncidentId, newrow[1].id })

      -- Return the updated row with the new reportid to the client
      cb(newIncidentId)
      return
    end
  end
  cb(nil)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetCurrentUser', function(source, cb, data)
  local CurrentUser = {}
  local Player = QBCore.Functions.GetPlayer(source)
  if Player ~= nil then
    local pfp = MySQL.query.await("SELECT pfp FROM ecrp_mdt_profiles WHERE citizenid = ?",
      { Player.PlayerData.citizenid })
    CurrentUser = {
      name = Player.PlayerData.charinfo.firstname .. " " .. Player.PlayerData.charinfo.lastname,
      callsign = Player.PlayerData.metadata.callsign,
      pfp = pfp[1].pfp
    }
    cb(CurrentUser)
  end
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetOfficers', function(source, cb, data)
  local Players = {}
  for k, v in pairs(QBCore.Functions.GetQBPlayers()) do
    if v.PlayerData.job.type and Config.JobTypes[v.PlayerData.job.type] then
      local pfp = MySQL.query.await("SELECT pfp FROM ecrp_mdt_profiles WHERE citizenid = ?", { v.PlayerData.citizenid })
      Players[#Players + 1] = {
        firstname = v.PlayerData.charinfo.firstname,
        lastname = v.PlayerData.charinfo.lastname,
        callsign = v.PlayerData.metadata.callsign,
        citizenid = v.PlayerData.citizenid,
        pfp = pfp[1].pfp
      }
    end
  end
  cb(Players)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetCitizens', function(source, cb, data)
  local Players = {}
  for k, v in pairs(QBCore.Functions.GetQBPlayers()) do
    local pfp = MySQL.query.await("SELECT pfp FROM ecrp_mdt_profiles WHERE citizenid = ?", { v.PlayerData.citizenid })
    if Config.CitizensIncludeLeo then
      Players[#Players + 1] = {
        firstname = v.PlayerData.charinfo.firstname,
        lastname = v.PlayerData.charinfo.lastname,
        citizenid = v.PlayerData.citizenid,
        pfp = pfp[1].pfp
      }
    else
      if not (v.PlayerData.job.type and Config.JobTypes[v.PlayerData.job.type]) then
        Players[#Players + 1] = {
          firstname = v.PlayerData.charinfo.firstname,
          lastname = v.PlayerData.charinfo.lastname,
          citizenid = v.PlayerData.citizenid,
          pfp = pfp[1].pfp
        }
      end
    end
  end
  cb(Players)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetCriminals', function(source, cb, data)
  local profile = MySQL.query.await("SELECT citizenid, name, pfp FROM ecrp_mdt_profiles LIMIT 25")
  cb(profile)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:SearchCriminals', function(source, cb, data)
  local profile = MySQL.query.await("SELECT citizenid, name, pfp FROM ecrp_mdt_profiles WHERE citizenid LIKE ? OR name LIKE ? LIMIT 25", {data, data})
  cb(profile)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetEvidence', function(source, cb, data)
  local evidence = MySQL.query.await("SELECT * FROM ecrp_mdt_evidence")
  cb(evidence)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetEvidenceInfo', function(source, cb, data)
  local evidence = MySQL.query.await("SELECT * FROM ecrp_mdt_evidence WHERE evidenceid = ?", { data })
  cb(evidence[1])
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetReport', function(source, cb, data)
  local report = MySQL.query.await("SELECT * FROM ecrp_mdt_reports WHERE reportid = ?", { data })
  if report[1] ~= nil then
    report[1].officers = json.decode(report[1].officers)

    local evidence = {}
    for _, value in ipairs(json.decode(report[1].evidence)) do
      local evidenceQ = MySQL.query.await("SELECT * FROM ecrp_mdt_evidence WHERE evidenceid = ?", { value })
      table.insert(evidence, evidenceQ[1])
    end

    local officers = {}
    for _, value in ipairs(report[1].officers) do
      local Player = MySQL.query.await("SELECT charinfo, metadata FROM players WHERE citizenid = ?", { value })
      -- local Player = QBCore.Functions.GetPlayerByCitizenId(value)
      local pfp = MySQL.query.await("SELECT pfp FROM ecrp_mdt_profiles WHERE citizenid = ?", { value })
      officers[#officers + 1] = {
        firstname = json.decode(Player[1].charinfo).firstname,
        lastname = json.decode(Player[1].charinfo).lastname,
        callsign = json.decode(Player[1].metadata).callsign,
        citizenid = value,
        pfp = pfp[1].pfp
      }
    end

    local citizens = {}
    for _, value in ipairs(json.decode(report[1].citizens)) do
      local Player = MySQL.query.await("SELECT charinfo FROM players WHERE citizenid = ?", { value })
      -- local Player = QBCore.Functions.GetPlayerByCitizenId(value)
      local pfp = MySQL.query.await("SELECT pfp FROM ecrp_mdt_profiles WHERE citizenid = ?", { value })
      citizens[#citizens + 1] = {
        firstname = json.decode(Player[1].charinfo).firstname,
        lastname = json.decode(Player[1].charinfo).lastname,
        citizenid = value,
        pfp = pfp[1].pfp
      }
    end

    report[1].citizens = citizens
    report[1].officers = officers
    report[1].evidence = evidence
    report[1].references = json.decode(report[1].references)
    report[1].tags = json.decode(report[1].tags)
    cb(report[1])
  else
    cb(nil)
  end
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetIncident', function(source, cb, data)
  local incident = MySQL.query.await("SELECT * FROM ecrp_mdt_incidents WHERE incidentid = ?", { data })
  if incident[1] ~= nil then
    incident[1].officers = json.decode(incident[1].officers)

    local evidence = {}
    for _, value in ipairs(json.decode(incident[1].evidence)) do
      local evidenceQ = MySQL.query.await("SELECT * FROM ecrp_mdt_evidence WHERE evidenceid = ?", { value })
      table.insert(evidence, evidenceQ[1])
    end

    local officers = {}
    for _, value in ipairs(incident[1].officers) do
      local Player = MySQL.query.await("SELECT charinfo, metadata FROM players WHERE citizenid = ?", { value })
      -- local Player = QBCore.Functions.GetPlayerByCitizenId(value)
      local pfp = MySQL.query.await("SELECT pfp FROM ecrp_mdt_profiles WHERE citizenid = ?", { value })
      officers[#officers + 1] = {
        firstname = json.decode(Player[1].charinfo).firstname,
        lastname = json.decode(Player[1].charinfo).lastname,
        callsign = json.decode(Player[1].metadata).callsign,
        citizenid = value,
        pfp = pfp[1].pfp
      }
    end


    local criminals = {}
    for _, value in ipairs(json.decode(incident[1].criminals)) do
      local profile = MySQL.query.await("SELECT pfp, name FROM ecrp_mdt_profiles WHERE citizenid = ?", { value })
      criminals[#criminals + 1] = {
        name = profile[1].name,
        citizenid = value,
        pfp = profile[1].pfp
      }
    end

    -- local Author = QBCore.Functions.GetPlayerByCitizenId(incident[1].author)
    local Author = MySQL.query.await("SELECT charinfo FROM players WHERE citizenid = ?", { incident[1].author })

    incident[1].criminals = criminals
    incident[1].officers = officers
    incident[1].evidence = evidence
    incident[1].author = json.decode(Author[1].charinfo).firstname .. " " .. json.decode(Author[1].charinfo).lastname
    incident[1].tags = json.decode(incident[1].tags)
    incident[1].references = json.decode(incident[1].references)
    cb(incident[1])
  else
    cb(nil)
  end
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetReports', function(source, cb, data)
  local reports = MySQL.query.await("SELECT * FROM ecrp_mdt_reports")
  cb(reports)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetIncidents', function(source, cb, data)
  local reports = MySQL.query.await("SELECT * FROM ecrp_mdt_incidents")
  cb(reports)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:SaveProfile', function(source, cb, data)
  MySQL.update(
    'UPDATE ecrp_mdt_profiles SET name = ?, pfp = ?, dna = ?, points = ?, text = ?, tags = ? WHERE citizenid = ?',
    { data.name, data.pfp, data.dna, data.points, data.text, data.tags, data.citizenid })
  cb(true)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:SetWarrant', function(source, cb, data)
  if data.exists then
    MySQL.update(
      'DELETE FROM ecrp_mdt_warrants WHERE citizenid = ? AND incidentid = ?',
      { data.citizenid, data.incidentid })
  else
    local warrant = MySQL.query.await("SELECT * FROM ecrp_mdt_warrants WHERE citizenid = ? AND incidentid = ?",
      { data.citizenid, data.incidentid })
    if warrant[1] == nil then
      MySQL.insert('INSERT INTO ecrp_mdt_warrants (end_date, citizenid, incidentid) VALUES (?, ?, ?)',
        { data.end_date, data.citizenid, data.incidentid })
    end
  end
  cb(true)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetWarrants', function(source, cb, data)
  local returnWarrants = {}
  local query = [[
    SELECT w.incidentid, w.end_date, w.citizenid, p.pfp, p.name, i.title
    FROM ecrp_mdt_warrants AS w
    INNER JOIN ecrp_mdt_profiles AS p ON w.citizenid = p.citizenid
    INNER JOIN ecrp_mdt_incidents AS i ON w.incidentid = i.incidentid
  ]]
  local warrants = MySQL.query.await(query)
  for _, warrant in ipairs(warrants) do
    local newData = {
      pfp = warrant.pfp,
      name = warrant.name,
      incidentid = warrant.incidentid,
      end_date = warrant.end_date,
      citizenid = warrant.citizenid,
    }
    table.insert(returnWarrants, newData)
  end
  cb(returnWarrants)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:DeleteEvidence', function(source, cb, data)
  MySQL.update("DELETE FROM ecrp_mdt_evidence WHERE evidenceid = ?", { data })
  cb(true)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:SaveReport', function(source, cb, data)
  MySQL.update(
    'UPDATE ecrp_mdt_reports SET description = ?, officers = ?, evidence = ?, citizens = ?, tags = ?, `references` = ? WHERE reportid = ?',
    { data.description, data.officers, data.evidence, data.citizens, data.tags, data.references, data.reportid })
  cb(true)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:SaveIncident', function(source, cb, data)
  MySQL.update(
    'UPDATE ecrp_mdt_incidents SET description = ?, evidence = ?, officers = ?, tags = ?, `references` = ? WHERE incidentid = ?',
    { data.description, data.evidence, data.officers, data.tags, data.references, data.incidentid })
  cb(true)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:SaveCharges', function(source, cb, data)
  MySQL.update(
    'UPDATE ecrp_mdt_incidents SET charges = ?, criminals = ? WHERE incidentid = ?',
    { data.charges, data.criminals, data.incidentid })

  MySQL.update(
    'UPDATE ecrp_mdt_profiles SET history = ? WHERE citizenid = ?',
    { data.history, data.citizenid })
  cb(true)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetCharges', function(source, cb, data)
  local charges = MySQL.query.await("SELECT charges FROM ecrp_mdt_incidents WHERE incidentid = ?", { data.incidentid })
  local returnData = {
    charges = json.decode(charges[1]["charges"])
  }
  if data.citizenid then
    local history = MySQL.query.await("SELECT history FROM ecrp_mdt_profiles WHERE citizenid = ?", { data.citizenid })
    returnData.history = json.decode(history[1]["history"])
  end
  cb(returnData)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:CreateEvidence', function(source, cb, data)
  local player = QBCore.Functions.GetPlayer(source)
  if player ~= nil then
    if data.category == "photo" then
      MySQL.insert('INSERT INTO ecrp_mdt_evidence (title, category, stateid, photo) VALUES (?, ?, ?, ?)',
        { data.title, data.category, data.stateid, data.photo })
    end

    local newrow = MySQL.query.await("SELECT id FROM ecrp_mdt_evidence ORDER BY id DESC LIMIT 1")
    if newrow[1] ~= nil then
      -- Calculate the new reportid based on the retrieved ID
      local newEvidenceId = tonumber(newrow[1].id) + 999

      -- Update the latest inserted row with the new reportid
      MySQL.Sync.execute('UPDATE ecrp_mdt_evidence SET evidenceid = ? WHERE id = ?',
        { newEvidenceId, newrow[1].id })

      -- Return the updated row with the new reportid to the client
      cb(newEvidenceId)
      return
    end
  end
  cb(nil)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:RevokeLicense', function(source, cb, data)
  local Player = QBCore.Functions.GetPlayerByCitizenId(data.citizenid)
  local licences = Player.PlayerData.metadata["licences"]
  local newLicenses = {}
  for k, v in pairs(licences) do
    local status = v
    if v ~= data.licenses[k] then
      status = false
    end
    newLicenses[k] = status
  end
  Player.Functions.SetMetaData("licences", newLicenses)
  cb(true)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetProfiles', function(source, cb, data)
  local players = MySQL.query.await('SELECT * FROM ecrp_mdt_profiles')
  cb(players)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetReferences', function(source, cb, data)
  local incidents = MySQL.query.await('SELECT incidentid, title FROM ecrp_mdt_incidents LIMIT 25')
  local reports = MySQL.query.await('SELECT reportid, title FROM ecrp_mdt_reports LIMIT 25')
  local mergedData = {}
  for _, incident in ipairs(incidents) do
    table.insert(mergedData, incident)
  end
  for _, report in ipairs(reports) do
    table.insert(mergedData, report)
  end
  cb(mergedData)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetIncidentReferences', function(source, cb, data)
  local references = MySQL.query.await("SELECT `references` FROM ecrp_mdt_incidents WHERE incidentid = ?", { data })
  cb(json.decode(references[1]['references']))
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetReportReferences', function(source, cb, data)
  local references = MySQL.query.await("SELECT `references` FROM ecrp_mdt_reports WHERE reportid = ?", { data })
  cb(json.decode(references[1]['references']))
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:SearchReferences', function(source, cb, data)
  local incidents = MySQL.query.await(
    'SELECT incidentid, title FROM ecrp_mdt_incidents WHERE incidentid LIKE ? OR title LIKE ? LIMIT 25', { data, data })
  local reports = MySQL.query.await(
    'SELECT reportid, title FROM ecrp_mdt_reports WHERE reportid LIKE ? OR title LIKE ? LIMIT 25', { data, data })
  local mergedData = {}
  for _, incident in ipairs(incidents) do
    table.insert(mergedData, incident)
  end
  for _, report in ipairs(reports) do
    table.insert(mergedData, report)
  end
  cb(mergedData)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetProfile', function(source, cb, data)
  local src = source
  local Player = QBCore.Functions.GetPlayer(src)
  local profile = {
    player = {},
    vehicles = {},
    properties = {},
    licenses = {}
  }
  local player = MySQL.query.await('SELECT * FROM ecrp_mdt_profiles WHERE citizenid = ?', { data })
  local vehicles = MySQL.query.await('SELECT plate FROM player_vehicles WHERE citizenid = ?', { data })
  local properties = MySQL.query.await('SELECT house FROM player_houses WHERE citizenid = ?', { data })
  local licenses = Player.PlayerData.metadata["licences"]
  profile.player = player[1]
  profile.vehicles = vehicles
  profile.properties = properties
  profile.licenses = licenses
  player[1].tags = json.decode(player[1].tags)
  player[1].history = json.decode(player[1].history)
  cb(profile)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:CreateStaff', function(source, cb, data)
  local player = MySQL.query.await('SELECT * FROM ecrp_mdt_profiles WHERE citizenid = ?', { data })
  if player[1] ~= nil then
    MySQL.insert.await('INSERT INTO ecrp_mdt_staff (citizenid) VALUES (?)',
      { player[1].citizenid })
    cb(player[1].citizenid)
  else
    cb(false)
  end
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetStaffMembers', function(source, cb, data)
  local returnData = {}
  local staff = MySQL.query.await('SELECT * FROM ecrp_mdt_staff')
  for _, s in ipairs(staff) do
    local member = MySQL.query.await('SELECT name, pfp FROM ecrp_mdt_profiles WHERE citizenid = ?', { s.citizenid })
    local newData = {
      pfp = member[1].pfp,
      name = member[1].name,
      citizenid = s.citizenid
    }
    table.insert(returnData, newData)
  end
  cb(returnData)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:GetStaffMember', function(source, cb, data)
  local staff = MySQL.query.await('SELECT * FROM ecrp_mdt_staff WHERE citizenid = ?', { data })
  local pfp = MySQL.query.await('SELECT pfp FROM ecrp_mdt_profiles WHERE citizenid = ?', { staff[1].citizenid })
  local player = MySQL.query.await('SELECT charinfo, metadata FROM players WHERE citizenid = ?', { staff[1].citizenid })
  local newData = {
    citizenid = staff[1].citizenid,
    user_type = staff[1].user_type,
    alias = staff[1].alias,
    certs = json.decode(staff[1].certs),
    departments = json.decode(staff[1].departments),
    ranks = json.decode(staff[1].ranks),
    pfp = pfp[1].pfp,
    phone = json.decode(player[1]["charinfo"]).phone,
    firstname = json.decode(player[1]["charinfo"]).firstname,
    lastname = json.decode(player[1]["charinfo"]).lastname,
    callsign = json.decode(player[1]["metadata"]).callsign
  }
  cb(newData)
end)

QBCore.Functions.CreateCallback('ecrp-mdt:server:SaveStaff', function(source, cb, data)
  MySQL.update(
    'UPDATE ecrp_mdt_staff SET user_type = ?, alias = ?, certs = ?, departments = ?, ranks = ? WHERE citizenid = ?',
    { data.user_type, data.alias, data.certs, data.departments, data.ranks, data.citizenid })
  MySQL.update(
    'UPDATE ecrp_mdt_profiles SET pfp = ? WHERE citizenid = ?',
    { data.pfp, data.citizenid })
  cb(true)
end)


function dump(o)
  if type(o) == 'table' then
    local s = '{ '
    for k, v in pairs(o) do
      if type(k) ~= 'number' then k = '"' .. k .. '"' end
      s = s .. '[' .. k .. '] = ' .. dump(v) .. ','
    end
    return s .. '} '
  else
    return tostring(o)
  end
end
