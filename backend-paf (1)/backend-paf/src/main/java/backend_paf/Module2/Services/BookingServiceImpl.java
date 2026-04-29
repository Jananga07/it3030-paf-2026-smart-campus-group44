package backend_paf.Module2.Services;

import backend_paf.Module2.Enums.BookingStatus;
import backend_paf.Module2.Model.Booking;
import backend_paf.Module2.Repository.BookingRepository;
import backend_paf.Module2.dto.BookingRequest;
import backend_paf.Module2.dto.BookingResponse;
// Module 4 integration – notification triggers
import backend_paf.Module4.service.NotificationEventService;
// Module 1 integration – resource name for notification messages
import backend_paf.Module1.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EmailService emailService;
    // Module 4 – triggers in-app notifications on booking status changes
    private final NotificationEventService notificationEventService;
    // Module 1 – used to look up resource name for richer notification messages
    private final ResourceRepository resourceRepository;

    public BookingServiceImpl(BookingRepository bookingRepository,
                              EmailService emailService,
                              NotificationEventService notificationEventService,
                              ResourceRepository resourceRepository) {
        this.bookingRepository         = bookingRepository;
        this.emailService              = emailService;
        this.notificationEventService  = notificationEventService;
        this.resourceRepository        = resourceRepository;
    }

    private BookingResponse toReponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getUserId(),
                booking.getResourceId(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getUserEmail(),
                booking.getPurpose(),
                booking.getAttendees(),
                booking.getStatus(),
                booking.getRejectionReason()
        );
    }

    @Override
    public BookingResponse createBooking(BookingRequest request) {
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                request.getResourceId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime()
        );
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Booking conflict: resource already booked for this time slot");
        }

        Booking booking = new Booking(
                request.getUserId(),
                request.getResourceId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime(),
                request.getUserEmail(),
                request.getPurpose(),
                request.getAttendees(),
                BookingStatus.PENDING
        );

        BookingResponse response = toReponse(bookingRepository.save(booking));

        emailService.sendEmail(
                request.getUserEmail(),
                "Booking Request Received — Smart Campus",
                "Dear User,\n\n" +
                        "Your booking request has been received and is awaiting admin approval.\n\n" +
                        "Booking Details:\n" +
                        "Resource ID : " + request.getResourceId() + "\n" +
                        "Date        : " + request.getBookingDate() + "\n" +
                        "Time        : " + request.getStartTime() + " - " + request.getEndTime() + "\n" +
                        "Purpose     : " + request.getPurpose() + "\n\n" +
                        "We will notify you once your booking is reviewed.\n\n" +
                        "Smart Campus Operations Hub"
        );

        return response;
    }

    @Override
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        return toReponse(booking);
    }

    @Override
    public List<BookingResponse> getBookingByUser(Long userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(this::toReponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::toReponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getAllBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status)
                .stream()
                .map(this::toReponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponse approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be approved");
        }
        booking.setStatus(BookingStatus.APPROVED);
        BookingResponse response = toReponse(bookingRepository.save(booking));

        emailService.sendEmail(
                booking.getUserEmail(),
                "Booking Approved — Smart Campus",
                "Dear User,\n\n" +
                        "Great news! Your booking has been APPROVED.\n\n" +
                        "Booking Details:\n" +
                        "Resource ID : " + booking.getResourceId() + "\n" +
                        "Date        : " + booking.getBookingDate() + "\n" +
                        "Time        : " + booking.getStartTime() + " - " + booking.getEndTime() + "\n" +
                        "Purpose     : " + booking.getPurpose() + "\n\n" +
                        "Please arrive on time. You may cancel if plans change.\n\n" +
                        "Smart Campus Operations Hub"
        );

        // Module 4 – send in-app notification to the user
        String resourceName = resourceRepository.findById(booking.getResourceId())
                .map(r -> r.getName()).orElse("Resource #" + booking.getResourceId());
        notificationEventService.notifyBookingApproved(
                booking.getUserId(), booking.getId(), resourceName);

        return response;
    }

    @Override
    public BookingResponse rejectBooking(Long id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be rejected");
        }
        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);
        BookingResponse response = toReponse(bookingRepository.save(booking));

        emailService.sendEmail(
                booking.getUserEmail(),
                "Booking Rejected — Smart Campus",
                "Dear User,\n\n" +
                        "Unfortunately your booking request has been REJECTED.\n\n" +
                        "Booking Details:\n" +
                        "Resource ID     : " + booking.getResourceId() + "\n" +
                        "Date            : " + booking.getBookingDate() + "\n" +
                        "Time            : " + booking.getStartTime() + " - " + booking.getEndTime() + "\n" +
                        "Rejection Reason: " + reason + "\n\n" +
                        "You may submit a new booking with a different time or resource.\n\n" +
                        "Smart Campus Operations Hub"
        );

        // Module 4 – send in-app notification to the user
        String resourceName = resourceRepository.findById(booking.getResourceId())
                .map(r -> r.getName()).orElse("Resource #" + booking.getResourceId());
        notificationEventService.notifyBookingRejected(
                booking.getUserId(), booking.getId(), resourceName);

        return response;
    }

    @Override
    public BookingResponse cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new RuntimeException("Only approved bookings can be cancelled");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        BookingResponse response = toReponse(bookingRepository.save(booking));

        // Module 4 – send in-app notification to the user
        String resourceName = resourceRepository.findById(booking.getResourceId())
                .map(r -> r.getName()).orElse("Resource #" + booking.getResourceId());
        notificationEventService.notifyBookingCancelled(
                booking.getUserId(), booking.getId(), resourceName);

        return response;
    }

    @Override
    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found with id: " + id);
        }
        bookingRepository.deleteById(id);
    }
}
