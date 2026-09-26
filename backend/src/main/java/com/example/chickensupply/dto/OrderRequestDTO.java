package com.example.chickensupply.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class OrderRequestDTO {
    private LocalDate deliveryDate;
    private LocalTime deliveryTime;
    private String notes;
    private List<OrderItemRequestDTO> items;

    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }
    public LocalTime getDeliveryTime() { return deliveryTime; }
    public void setDeliveryTime(LocalTime deliveryTime) { this.deliveryTime = deliveryTime; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public List<OrderItemRequestDTO> getItems() { return items; }
    public void setItems(List<OrderItemRequestDTO> items) { this.items = items; }

    public static class OrderItemRequestDTO {
        private String type;
        private Double quantity;

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public Double getQuantity() { return quantity; }
        public void setQuantity(Double quantity) { this.quantity = quantity; }
    }
}
