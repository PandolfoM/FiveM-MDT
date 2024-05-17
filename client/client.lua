local QBCore = exports['qb-core']:GetCoreObject()
local isOpen = false
local tabletObj = 0
local tabletDict = "amb@code_human_in_bus_passenger_idles@female@tablet@base"
local tabletAnim = "base"
local tabletProp = 'prop_cs_tablet'
local tabletBone = 60309
local tabletOffset = vector3(0.03, 0.002, -0.0)
local tabletRot = vector3(10.0, 160.0, 0.0)

local function toggleNuiFrame(shouldShow)
  isOpen = shouldShow
  SetNuiFocus(shouldShow, shouldShow)
  SendReactMessage('setVisible', shouldShow)
end

local function doAnimation()
  if not isOpen then
      return
  end
  -- Animation
  RequestAnimDict(tabletDict)
  while not HasAnimDictLoaded(tabletDict) do
      Citizen.Wait(100)
  end
  -- Model
  RequestModel(tabletProp)
  while not HasModelLoaded(tabletProp) do
      Citizen.Wait(100)
  end

  local plyPed = PlayerPedId()
  tabletObj = CreateObject(tabletProp, 0.0, 0.0, 0.0, true, true, false)
  local tabletBoneIndex = GetPedBoneIndex(plyPed, tabletBone)

  AttachEntityToEntity(tabletObj, plyPed, tabletBoneIndex, tabletOffset.x, tabletOffset.y, tabletOffset.z,
      tabletRot.x, tabletRot.y, tabletRot.z, true, false, false, false, 2, true)
  SetModelAsNoLongerNeeded(tabletProp)

  CreateThread(function()
      while isOpen do
          Wait(0)
          if not IsEntityPlayingAnim(plyPed, tabletDict, tabletAnim, 3) then
              TaskPlayAnim(plyPed, tabletDict, tabletAnim, 3.0, 3.0, -1, 49, 0, 0, 0, 0)
          end
      end

      ClearPedSecondaryTask(plyPed)
      Citizen.Wait(250)
      DetachEntity(tabletObj, true, false)
      DeleteEntity(tabletObj)
  end)
end

-- RegisterCommand('mdt2', function()
--   toggleNuiFrame(true)
--   debugPrint('Show NUI frame')
-- end, false)

RegisterNetEvent("ecrp-mdt:client:openMdt", function ()
  toggleNuiFrame(true)
  debugPrint('Show NUI frame')
  doAnimation()
end)

-- Callbacks --
RegisterNUICallback('GetCurrentUser', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetCurrentUser', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('CreateProfile', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:CreateProfile', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('CreateReport', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:CreateReport', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('CreateIncident', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:CreateIncident', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetReport', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetReport', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetIncident', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetIncident', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetOfficers', function(_, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetOfficers', function(data)
    cb(data)
  end)
end)

RegisterNUICallback('GetCitizens', function(_, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetCitizens', function(data)
    cb(data)
  end)
end)

RegisterNUICallback('GetCriminals', function(_, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetCriminals', function(data)
    cb(data)
  end)
end)

RegisterNUICallback('SearchCriminals', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:SearchCriminals', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetReports', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetReports', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetIncidents', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetIncidents', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetEvidence', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetEvidence', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetEvidenceInfo', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetEvidenceInfo', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetEvidence', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetEvidence', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('SaveProfile', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:SaveProfile', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('SetWarrant', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:SetWarrant', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetWarrants', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetWarrants', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('SaveEvidence', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:SaveEvidence', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('DeleteEvidence', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:DeleteEvidence', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('SaveReport', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:SaveReport', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('SaveIncident', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:SaveIncident', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('SaveCharges', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:SaveCharges', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetCharges', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetCharges', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('CreateEvidence', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:CreateEvidence', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetProfiles', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetProfiles', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetProfile', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetProfile', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('CreateStaff', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:CreateStaff', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetStaffMembers', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetStaffMembers', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetStaffMember', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetStaffMember', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('SaveStaff', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:SaveStaff', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetReferences', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetReferences', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetIncidentReferences', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetIncidentReferences', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('GetReportReferences', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:GetReportReferences', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('SearchReferences', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:SearchReferences', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('RevokeLicense', function(data, cb)
  QBCore.Functions.TriggerCallback('ecrp-mdt:server:RevokeLicense', function(data)
    cb(data)
  end, data)
end)

RegisterNUICallback('hideFrame', function(_, cb)
  toggleNuiFrame(false)
  debugPrint('Hide NUI frame')
  cb({})
end)

AddEventHandler('onResourceStop', function(resourceName)
  if (GetCurrentResourceName() ~= resourceName) then
      return
  end
  ClearPedSecondaryTask(PlayerPedId())
  SetEntityAsMissionEntity(tabletObj, true, true)
  DetachEntity(tabletObj, true, false)
  DeleteObject(tabletObj)
end)