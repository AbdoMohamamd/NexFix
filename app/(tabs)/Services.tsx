import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

// Icons
import SvgInvoice from "@/assets/Icons/Invoice";
import SvgPhoto from "@/assets/Icons/Photo";
import SvgStar from "@/assets/Icons/Star";

// Components
import { serviceAPI, vehicleAPI } from "@/assets/utils/Api/api";
import Button from "@/components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../Context/AuthProvider";

// Types
interface Vehicle {
  vehicule_ID: number;
  vehicule_Model: string;
  vehicule_PlateNb?: string;
}

interface Service {
  service_ID: number;
  service_Title: string;
  service_StartDate: string;
  service_FinishDate: string | null;
  service_TotalFees: number;
  service_Status: number;
  service_Description: string;
  service_VehiculeID: number;
}

interface ServicePart {
  part_ID: number;
  servicePart_ID: number;
  part_Name: string;
  servicePart_Qty: string;
  servicePartUnitPrice: number;
  servicePart_Total: number;
  categoryPart_Name: string;
  part_UnitPrice: number;
}

interface ServiceMedia {
  media_ID: number;
  media_Path: string;
  media_Description: string;
  media_TypeID: number;
}

interface PartDetails {
  part_ID: number;
  part_Name: string;
  part_UnitPrice: number;
  categoryPart_Name: string;
}

const Services = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceParts, setServiceParts] = useState<ServicePart[]>([]);
  const [partDetails, setPartDetails] = useState<Record<number, PartDetails>>(
    {}
  );
  const [serviceMedia, setServiceMedia] = useState<ServiceMedia[]>([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPhotosModal, setShowPhotosModal] = useState(false);

  // Fetch vehicles and services
  useEffect(() => {
    if (!user?.accID) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Get user's vehicles
        const vehiclesResponse = await vehicleAPI.getVehiclesByCustomerId(
          user.accID
        );
        const userVehicles = vehiclesResponse.data.data.vehicule || [];
        setVehicles(userVehicles);

        // 2. Get services for all vehicles
        const allServices: Service[] = [];

        for (const vehicle of userVehicles) {
          try {
            const servicesResponse = await serviceAPI.getServiceByVehiculeID(
              vehicle.vehicule_ID
            );
            const vehicleServices = servicesResponse.data.data.services || [];
            allServices.push(...vehicleServices);
          } catch (error) {
            console.error(
              `Error fetching services for vehicle ${vehicle.vehicule_ID}:`,
              error
            );
          }
        }

        // Sort services by date (newest first)
        const sortedServices = allServices.sort(
          (a, b) =>
            new Date(b.service_StartDate).getTime() -
            new Date(a.service_StartDate).getTime()
        );

        setServices(sortedServices);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.accID]);
  // Fetch service details for invoice
  const fetchServiceDetails = async (serviceID: number) => {
    try {
      console.log("Fetching service details for ID:", serviceID);

      // Get detailed service information with parts
      const response = await serviceAPI.getServiceByServiceID(serviceID);
      console.log("Service details response:", response.data);

      const serviceData = response.data.data;

      // Check if serviceData is an object or array
      let serviceInfo: any;
      let partsData: any[] = [];

      if (Array.isArray(serviceData)) {
        // If it's an array (multiple parts for the same service)
        serviceInfo = serviceData[0]; // Get service info from first item
        partsData = serviceData;
      } else if (serviceData && typeof serviceData === "object") {
        // If it's a single object
        serviceInfo = serviceData;

        // Check if there are parts in the service
        if (serviceData.part_ID) {
          // This service has a single part
          partsData = [serviceData];
        } else {
          // This service has no parts
          partsData = [];
        }
      } else {
        // If it's an array of services (from your earlier example)
        if (Array.isArray(response.data.data?.services)) {
          const allServices = response.data.data.services;
          // Filter for the specific service ID
          const matchingServices = allServices.filter(
            (s: any) => s.service_ID === serviceID
          );
          if (matchingServices.length > 0) {
            serviceInfo = matchingServices[0];
            partsData = matchingServices.filter((s: any) => s.part_ID);
          }
        }
      }

      // Extract parts from service details
      const uniqueParts: ServicePart[] = [];
      const partIds: number[] = [];

      partsData.forEach((item: any) => {
        if (item.part_ID && !partIds.includes(item.part_ID)) {
          partIds.push(item.part_ID);
          uniqueParts.push({
            part_ID: item.part_ID,
            servicePart_ID: item.servicePart_ID,
            part_Name: item.part_Name,
            servicePart_Qty: item.servicePart_Qty,
            servicePartUnitPrice: item.servicePartUnitPrice,
            servicePart_Total: item.servicePart_Total,
            categoryPart_Name: item.categoryPart_Name,
            part_UnitPrice: item.part_UnitPrice,
          });
        }
      });

      console.log("Extracted unique parts:", uniqueParts);

      // Fetch additional part details for each part using part select API
      const partDetailsMap: Record<number, PartDetails> = {};

      for (const part of uniqueParts) {
        try {
          console.log(`Fetching details for part ID: ${part.part_ID}`);
          const partResponse = await serviceAPI.getServicePartByID(
            part.part_ID
          );
          console.log(
            `Part details response for ${part.part_ID}:`,
            partResponse.data
          );

          const partData = partResponse.data.data;
          if (partData) {
            partDetailsMap[part.part_ID] = {
              part_ID: partData.part_ID,
              part_Name: partData.part_Name,
              part_UnitPrice: partData.part_UnitPrice,
              categoryPart_Name: partData.categoryPart_Name,
            };
          }
        } catch (error) {
          console.error(
            `Error fetching details for part ${part.part_ID}:`,
            error
          );
          // Use the data from the service response as fallback
          partDetailsMap[part.part_ID] = {
            part_ID: part.part_ID,
            part_Name: part.part_Name,
            part_UnitPrice: part.part_UnitPrice || part.servicePartUnitPrice,
            categoryPart_Name: part.categoryPart_Name,
          };
        }
      }

      console.log("Part details map:", partDetailsMap);

      setServiceParts(uniqueParts);
      setPartDetails(partDetailsMap);

      // Create selected service object
      const selectedServiceObj: Service = {
        service_ID: serviceInfo?.service_ID || serviceID,
        service_Title: serviceInfo?.service_Title || "Unknown Service",
        service_StartDate:
          serviceInfo?.service_StartDate || new Date().toISOString(),
        service_FinishDate: serviceInfo?.service_FinishDate || null,
        service_TotalFees: serviceInfo?.service_TotalFees || 0,
        service_Status: serviceInfo?.service_Status || 2,
        service_Description: serviceInfo?.service_Description || "",
        service_VehiculeID: serviceInfo?.service_VehiculeID || 0,
      };

      setSelectedService(selectedServiceObj);
      setShowInvoiceModal(true);
    } catch (error) {
      console.error("Error fetching service details:", error);
      alert("Failed to load service details. Please try again.");
    }
  };

  // Fetch service media
  const fetchServiceMedia = async (serviceID: number) => {
    try {
      console.log("Fetching media for service ID:", serviceID);
      const response = await serviceAPI.getServiceMediaByID(serviceID);
      console.log("Media response:", response.data);

      const media = response.data.data?.media || [];
      console.log("Extracted media:", media);

      setServiceMedia(media);
      setShowPhotosModal(true);
    } catch (error) {
      console.error("Error fetching service media:", error);
      alert("Failed to load service photos. Please try again.");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get vehicle details
  const getVehicleDetails = (vehicleID: number) => {
    const vehicle = vehicles.find((v) => v.vehicule_ID === vehicleID);
    return vehicle
      ? `${vehicle.vehicule_Model} ${
          vehicle.vehicule_PlateNb ? `(${vehicle.vehicule_PlateNb})` : ""
        }`
      : "Unknown Vehicle";
  };

  // Get status text
  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "In Progress";
      case 3:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  // Get status color
  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return "#FEF3C7"; // Yellow for pending
      case 2:
        return "#DBEAFE"; // Green for completed
      case 3:
        return "#D1FAE5"; // Blue for in progress
      default:
        return "#F3F4F6";
    }
  };

  // Get status text color
  const getStatusTextColor = (status: number) => {
    switch (status) {
      case 1:
        return "#92400E";
      case 2:
        return "#065F46";
      case 3:
        return "#1E40AF";
      default:
        return "#6B7280";
    }
  };

  // Calculate subtotal for parts
  const calculatePartsSubtotal = () => {
    return serviceParts.reduce((sum, part) => sum + part.servicePart_Total, 0);
  };

  // Calculate labor cost
  const calculateLaborCost = () => {
    if (!selectedService) return 0;
    const partsSubtotal = calculatePartsSubtotal();
    return selectedService.service_TotalFees - partsSubtotal;
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#F1C02C" />
      </SafeAreaView>
    );
  }

  if (services.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: wp("5%"),
          }}
        >
          <Text
            style={{
              fontFamily: "Arimo-Bold",
              fontSize: wp("4%"),
              color: "#6A7282",
              textAlign: "center",
            }}
          >
            No services found for your vehicles
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("4%"),
          paddingVertical: hp("2%"),
          gap: hp("1.5%"),
        }}
        showsVerticalScrollIndicator={false}
      >
        {services.map((service) => (
          <View
            key={service.service_ID}
            style={{
              backgroundColor: "#ffffff",
              borderWidth: wp("0.25%"),
              borderColor: "#E5E7EB",
              borderRadius: wp("2.5%"),
              overflow: "hidden",
              padding: wp("3%"),
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                gap: wp("3%"),
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  padding: wp("3%"),
                  backgroundColor: "#F3F4F6",
                  borderRadius: wp("2.5%"),
                  width: wp("15%"),
                  height: wp("15%"),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("@/assets/images/key.png")}
                  style={{
                    width: wp("9%"),
                    height: wp("9%"),
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Arimo-Bold",
                    fontSize: wp("4%"),
                    marginBottom: hp("0.5%"),
                  }}
                >
                  {service.service_Title}
                </Text>
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3.5%"),
                    color: "#6A7282",
                    marginBottom: hp("0.5%"),
                  }}
                >
                  {getVehicleDetails(service.service_VehiculeID)}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: wp("2%"),
                    marginBottom: hp("0.5%"),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: wp("3%"),
                      color: "#6A7282",
                    }}
                  >
                    {formatDate(service.service_StartDate)}
                  </Text>
                  <View
                    style={{
                      backgroundColor: getStatusColor(service.service_Status),
                      paddingHorizontal: wp("2%"),
                      paddingVertical: hp("0.25%"),
                      borderRadius: wp("1%"),
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Arimo-Medium",
                        fontSize: wp("2.5%"),
                        color: getStatusTextColor(service.service_Status),
                      }}
                    >
                      {getStatusText(service.service_Status)}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Arimo-Bold",
                    fontSize: wp("4.5%"),
                    color: "#F1C02C",
                  }}
                >
                  ${service.service_TotalFees.toFixed(2)}
                </Text>
              </View>
            </Pressable>

            <View
              style={{
                height: wp("0.25%"),
                backgroundColor: "#F1C02C",
                marginVertical: hp("1.5%"),
              }}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: wp("5%"),
                marginBottom: hp("1.5%"),
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: wp("1.5%"),
                }}
                onPress={() => fetchServiceDetails(service.service_ID)}
              >
                <SvgInvoice width={wp("5%")} height={wp("5%")} />
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3%"),
                    color: "#6A7282",
                  }}
                >
                  Invoice
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: wp("1.5%"),
                }}
                onPress={() => fetchServiceMedia(service.service_ID)}
              >
                <SvgPhoto width={wp("5%")} height={wp("5%")} />
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3%"),
                    color: "#6A7282",
                  }}
                >
                  Photos
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: hp("1%") }}>
              <Button
                onPress={() => {
                  router.navigate({
                    pathname: "/Pages/RateService",
                    params: {
                      serviceId: service.service_ID,
                    },
                  });
                }}
                text="Rate"
                type="secondary"
                size="small"
                wrap={false}
                Icon={SvgStar}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Invoice Modal */}
      <Modal
        visible={showInvoiceModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowInvoiceModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <ScrollView
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: wp("5%"),
              borderTopRightRadius: wp("5%"),
              maxHeight: hp("80%"),
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ padding: wp("5%") }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: hp("2%"),
                }}
              >
                <Text style={{ fontFamily: "Arimo-Bold", fontSize: wp("5%") }}>
                  Service Invoice
                </Text>
                <TouchableOpacity onPress={() => setShowInvoiceModal(false)}>
                  <Text style={{ fontSize: wp("6%"), color: "#6A7282" }}>
                    ×
                  </Text>
                </TouchableOpacity>
              </View>

              {selectedService && (
                <>
                  {/* Service Details */}
                  <View style={{ marginBottom: hp("3%") }}>
                    <Text
                      style={{
                        fontFamily: "Arimo-Bold",
                        fontSize: wp("4.5%"),
                        marginBottom: hp("0.5%"),
                      }}
                    >
                      {selectedService.service_Title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Arimo-Regular",
                        fontSize: wp("3.5%"),
                        color: "#6A7282",
                        marginBottom: hp("1%"),
                      }}
                    >
                      {selectedService.service_Description}
                    </Text>
                    <View style={{ flexDirection: "row", gap: wp("3%") }}>
                      <Text
                        style={{
                          fontFamily: "Arimo-Medium",
                          fontSize: wp("3.5%"),
                          color: "#6A7282",
                        }}
                      >
                        Service Date:{" "}
                        {formatDate(selectedService.service_StartDate)}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Arimo-Medium",
                          fontSize: wp("3.5%"),
                          color: "#6A7282",
                        }}
                      >
                        Vehicle:{" "}
                        {getVehicleDetails(selectedService.service_VehiculeID)}
                      </Text>
                    </View>
                  </View>

                  {/* Parts List */}
                  <View style={{ marginBottom: hp("2%") }}>
                    <Text
                      style={{
                        fontFamily: "Arimo-Bold",
                        fontSize: wp("4%"),
                        marginBottom: hp("2%"),
                        borderBottomWidth: 1,
                        borderBottomColor: "#E5E7EB",
                        paddingBottom: hp("1%"),
                      }}
                    >
                      Parts Used
                    </Text>

                    {serviceParts.length > 0 ? (
                      serviceParts.map((part) => {
                        const details = partDetails[part.part_ID];
                        return (
                          <View
                            key={part.servicePart_ID}
                            style={{
                              marginBottom: hp("2%"),
                              paddingBottom: hp("1%"),
                              borderBottomWidth: 1,
                              borderBottomColor: "#F3F4F6",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Arimo-Bold",
                                fontSize: wp("3.8%"),
                                marginBottom: hp("0.5%"),
                              }}
                            >
                              {details?.part_Name || part.part_Name}
                            </Text>
                            <Text
                              style={{
                                fontFamily: "Arimo-Regular",
                                fontSize: wp("3.2%"),
                                color: "#6A7282",
                                marginBottom: hp("0.5%"),
                              }}
                            >
                              Category:{" "}
                              {details?.categoryPart_Name ||
                                part.categoryPart_Name}
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: "Arimo-Regular",
                                  fontSize: wp("3.2%"),
                                }}
                              >
                                {part.servicePart_Qty} × $
                                {part.servicePartUnitPrice.toFixed(2)}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: "Arimo-Medium",
                                  fontSize: wp("3.5%"),
                                }}
                              >
                                ${part.servicePart_Total.toFixed(2)}
                              </Text>
                            </View>
                          </View>
                        );
                      })
                    ) : (
                      <Text
                        style={{
                          fontFamily: "Arimo-Regular",
                          fontSize: wp("3.5%"),
                          color: "#6A7282",
                          textAlign: "center",
                          paddingVertical: hp("2%"),
                        }}
                      >
                        No parts used in this service
                      </Text>
                    )}
                  </View>

                  {/* Cost Breakdown */}
                  <View
                    style={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: wp("2%"),
                      padding: wp("4%"),
                      marginTop: hp("2%"),
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Arimo-Bold",
                        fontSize: wp("4%"),
                        marginBottom: hp("2%"),
                      }}
                    >
                      Cost Breakdown
                    </Text>

                    {/* Parts Subtotal */}
                    {serviceParts.length > 0 && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: hp("1%"),
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Arimo-Regular",
                            fontSize: wp("3.5%"),
                            color: "#6A7282",
                          }}
                        >
                          Parts Subtotal
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Arimo-Medium",
                            fontSize: wp("3.5%"),
                          }}
                        >
                          ${calculatePartsSubtotal().toFixed(2)}
                        </Text>
                      </View>
                    )}

                    {/* Labor Cost */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: hp("1%"),
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Arimo-Regular",
                          fontSize: wp("3.5%"),
                          color: "#6A7282",
                        }}
                      >
                        Labor Cost
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Arimo-Medium",
                          fontSize: wp("3.5%"),
                        }}
                      >
                        ${calculateLaborCost().toFixed(2)}
                      </Text>
                    </View>

                    {/* Total */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: hp("2%"),
                        paddingTop: hp("1.5%"),
                        borderTopWidth: 1,
                        borderTopColor: "#E5E7EB",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Arimo-Bold",
                          fontSize: wp("4.5%"),
                        }}
                      >
                        Total Amount
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Arimo-Bold",
                          fontSize: wp("4.5%"),
                          color: "#F1C02C",
                        }}
                      >
                        ${selectedService.service_TotalFees.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Photos Modal */}
      <Modal
        visible={showPhotosModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPhotosModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: wp("5%"),
              borderTopRightRadius: wp("5%"),
              padding: wp("5%"),
              maxHeight: hp("80%"),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: hp("2%"),
              }}
            >
              <Text style={{ fontFamily: "Arimo-Bold", fontSize: wp("5%") }}>
                Service Photos
              </Text>
              <TouchableOpacity onPress={() => setShowPhotosModal(false)}>
                <Text style={{ fontSize: wp("6%"), color: "#6A7282" }}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {serviceMedia.map((media) => (
                <View key={media.media_ID} style={{ marginBottom: hp("2%") }}>
                  <Image
                    source={{
                      uri: `http://siblani-001-site6.atempurl.com/${media.media_Path}`,
                    }} // Adjust base URL
                    style={{
                      width: "100%",
                      height: hp("30%"),
                      borderRadius: wp("2%"),
                      backgroundColor: "#F3F4F6",
                    }}
                    resizeMode="cover"
                  />
                  {media.media_Description && (
                    <Text
                      style={{
                        fontFamily: "Arimo-Regular",
                        fontSize: wp("3.5%"),
                        color: "#6A7282",
                        marginTop: hp("1%"),
                      }}
                    >
                      {media.media_Description}
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Services;
