import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from '../staff/staff.entity';
import { Leave } from '../leave/leave.entity';
import { Permission } from '../permission/permission.entity';
import { Response } from 'express';
import { createObjectCsvWriter } from 'csv-writer';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Staff) private staffRepo: Repository<Staff>,
    @InjectRepository(Leave) private leaveRepo: Repository<Leave>,
    @InjectRepository(Permission) private permRepo: Repository<Permission>,
  ) {}

  async getSummary(filters: {
    fromDate?: string;
    toDate?: string;
    month?: string;
    staffId?: string;
    department?: string;
  }) {
    const { fromDate, toDate, month, staffId, department } = filters;

    // Leave summary per staff
    const leaveQb = this.leaveRepo
      .createQueryBuilder('leave')
      .select('leave.staffId', 'staffId')
      .addSelect('staff.fullName', 'fullName')
      .addSelect('staff.department', 'department')
      .addSelect('SUM(CASE WHEN leave."isHalfDay" = true THEN 0.5 ELSE (leave."endDate" - leave."startDate" + 1) END)', 'totalLeaves')
      .addSelect("SUM(CASE WHEN leave.leaveType = 'sick' THEN (CASE WHEN leave.\"isHalfDay\" = true THEN 0.5 ELSE (leave.\"endDate\" - leave.\"startDate\" + 1) END) ELSE 0 END)", 'sickLeaves')
      .addSelect("SUM(CASE WHEN leave.leaveType = 'casual' THEN (CASE WHEN leave.\"isHalfDay\" = true THEN 0.5 ELSE (leave.\"endDate\" - leave.\"startDate\" + 1) END) ELSE 0 END)", 'casualLeaves')
      .addSelect("SUM(CASE WHEN leave.leaveType = 'paid' THEN (CASE WHEN leave.\"isHalfDay\" = true THEN 0.5 ELSE (leave.\"endDate\" - leave.\"startDate\" + 1) END) ELSE 0 END)", 'paidLeaves')
      .addSelect("SUM(CASE WHEN leave.leaveType = 'unpaid' THEN (CASE WHEN leave.\"isHalfDay\" = true THEN 0.5 ELSE (leave.\"endDate\" - leave.\"startDate\" + 1) END) ELSE 0 END)", 'unpaidLeaves')
      .leftJoin('leave.staff', 'staff')
      .groupBy('leave.staffId')
      .addGroupBy('staff.fullName')
      .addGroupBy('staff.department')
      .where("leave.status != 'rejected'");

    if (staffId) leaveQb.andWhere('leave.staffId = :staffId', { staffId });
    if (department) leaveQb.andWhere('staff.department = :department', { department });
    if (fromDate) leaveQb.andWhere('leave.startDate >= :fromDate', { fromDate });
    if (toDate) leaveQb.andWhere('leave.endDate <= :toDate', { toDate });
    if (month) leaveQb.andWhere("TO_CHAR(leave.startDate,'YYYY-MM') = :month", { month });

    const leaveSummary = await leaveQb.getRawMany();

    // Permission hours per staff
    const permQb = this.permRepo
      .createQueryBuilder('perm')
      .select('perm.staffId', 'staffId')
      .addSelect('staff.fullName', 'fullName')
      .addSelect('staff.department', 'department')
      .addSelect('SUM(perm.hours)', 'totalHours')
      .leftJoin('perm.staff', 'staff')
      .groupBy('perm.staffId')
      .addGroupBy('staff.fullName')
      .addGroupBy('staff.department');

    if (staffId) permQb.andWhere('perm.staffId = :staffId', { staffId });
    if (department) permQb.andWhere('staff.department = :department', { department });
    if (fromDate) permQb.andWhere('perm.date >= :fromDate', { fromDate });
    if (toDate) permQb.andWhere('perm.date <= :toDate', { toDate });
    if (month) permQb.andWhere("TO_CHAR(perm.date,'YYYY-MM') = :month", { month });

    const permSummary = await permQb.getRawMany();

    // Monthly summary
    const monthlyLeaveQb = this.leaveRepo
      .createQueryBuilder('leave')
      .select("TO_CHAR(leave.startDate,'YYYY-MM')", 'month')
      .addSelect('SUM(CASE WHEN leave."isHalfDay" = true THEN 0.5 ELSE (leave."endDate" - leave."startDate" + 1) END)', 'totalLeaves')
      .where("leave.status != 'rejected'")
      .groupBy("TO_CHAR(leave.startDate,'YYYY-MM')")
      .orderBy("TO_CHAR(leave.startDate,'YYYY-MM')", 'DESC');

    if (staffId) monthlyLeaveQb.andWhere('leave.staffId = :staffId', { staffId });
    if (department) {
      monthlyLeaveQb.leftJoin('leave.staff', 'staff');
      monthlyLeaveQb.andWhere('staff.department = :department', { department });
    }

    const monthlyLeave = await monthlyLeaveQb.getRawMany();

    const monthlyPermQb = this.permRepo
      .createQueryBuilder('perm')
      .select("TO_CHAR(perm.date,'YYYY-MM')", 'month')
      .addSelect('SUM(perm.hours)', 'totalHours')
      .groupBy("TO_CHAR(perm.date,'YYYY-MM')")
      .orderBy("TO_CHAR(perm.date,'YYYY-MM')", 'DESC');

    if (staffId) monthlyPermQb.andWhere('perm.staffId = :staffId', { staffId });

    const monthlyPerm = await monthlyPermQb.getRawMany();

    // Merge monthly data
    const monthMap: Record<string, { month: string; totalLeaves: number; totalPermissionHours: number }> = {};
    for (const row of monthlyLeave) {
      monthMap[row.month] = { month: row.month, totalLeaves: parseFloat(row.totalLeaves), totalPermissionHours: 0 };
    }
    for (const row of monthlyPerm) {
      if (!monthMap[row.month]) monthMap[row.month] = { month: row.month, totalLeaves: 0, totalPermissionHours: 0 };
      monthMap[row.month].totalPermissionHours = parseFloat(row.totalHours || '0');
    }
    const monthlySummary = Object.values(monthMap).sort((a, b) => b.month.localeCompare(a.month));

    return { leaveSummary, permSummary, monthlySummary };
  }

  async exportCsv(filters: any, res: Response) {
    const data = await this.getSummary(filters);
    const tmpDir = os.tmpdir();
    const filePath = path.join(tmpDir, `report_${Date.now()}.csv`);

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'fullName', title: 'Staff Name' },
        { id: 'department', title: 'Department' },
        { id: 'totalLeaves', title: 'Total Leaves' },
        { id: 'sickLeaves', title: 'Sick Leaves' },
        { id: 'casualLeaves', title: 'Casual Leaves' },
        { id: 'paidLeaves', title: 'Paid Leaves' },
        { id: 'unpaidLeaves', title: 'Unpaid Leaves' },
      ],
    });

    await csvWriter.writeRecords(data.leaveSummary);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leave_report.csv"');
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('end', () => fs.unlinkSync(filePath));
  }

  async exportPdf(filters: any, res: Response) {
    const data = await this.getSummary(filters);
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="staff_report.pdf"');
    doc.pipe(res);

    // Title
    doc.fontSize(20).fillColor('#1a1a2e').text('Staff Management Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#666').text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(1.5);

    // Leave Summary Table
    doc.fontSize(14).fillColor('#1a1a2e').text('Leave Summary per Staff');
    doc.moveDown(0.5);
    const leaveHeaders = ['Name', 'Dept', 'Total', 'Sick', 'Casual', 'Paid', 'Unpaid'];
    const colWidths = [130, 90, 50, 50, 55, 50, 55];
    let x = 40;
    const headerY = doc.y;
    doc.fontSize(9).fillColor('#fff');
    doc.rect(40, headerY - 4, 530, 18).fill('#2563eb');
    doc.fillColor('#fff');
    leaveHeaders.forEach((h, i) => {
      doc.text(h, x + 2, headerY, { width: colWidths[i], align: 'left' });
      x += colWidths[i];
    });
    doc.moveDown(0.3);

    data.leaveSummary.forEach((row: any, idx: number) => {
      const rowY = doc.y;
      if (idx % 2 === 0) doc.rect(40, rowY - 2, 530, 16).fill('#f0f4ff');
      doc.fillColor('#1a1a2e').fontSize(8);
      let rx = 40;
      const vals = [
        row.fullName || '-',
        row.department || '-',
        row.totalLeaves || '0',
        row.sickLeaves || '0',
        row.casualLeaves || '0',
        row.paidLeaves || '0',
        row.unpaidLeaves || '0',
      ];
      vals.forEach((v, i) => {
        doc.text(String(v), rx + 2, rowY, { width: colWidths[i], align: 'left' });
        rx += colWidths[i];
      });
      doc.moveDown(0.3);
    });

    doc.moveDown(1);
    doc.fontSize(14).fillColor('#1a1a2e').text('Permission Hours per Staff');
    doc.moveDown(0.5);
    const permHeaders = ['Name', 'Department', 'Total Permission Hours'];
    const permWidths = [180, 180, 170];
    let px = 40;
    const permHeaderY = doc.y;
    doc.rect(40, permHeaderY - 4, 530, 18).fill('#7c3aed');
    doc.fillColor('#fff').fontSize(9);
    permHeaders.forEach((h, i) => {
      doc.text(h, px + 2, permHeaderY, { width: permWidths[i] });
      px += permWidths[i];
    });
    doc.moveDown(0.3);

    data.permSummary.forEach((row: any, idx: number) => {
      const rowY = doc.y;
      if (idx % 2 === 0) doc.rect(40, rowY - 2, 530, 16).fill('#f5f0ff');
      doc.fillColor('#1a1a2e').fontSize(8);
      let rx = 40;
      [row.fullName || '-', row.department || '-', parseFloat(row.totalHours || '0').toFixed(1) + ' hrs'].forEach((v, i) => {
        doc.text(String(v), rx + 2, rowY, { width: permWidths[i] });
        rx += permWidths[i];
      });
      doc.moveDown(0.3);
    });

    doc.end();
  }

  async getDashboard() {
    const totalStaff = await this.staffRepo.count();
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const leavesThisMonth = await this.leaveRepo
      .createQueryBuilder('leave')
      .select('SUM(CASE WHEN leave."isHalfDay" = true THEN 0.5 ELSE (leave."endDate" - leave."startDate" + 1) END)', 'total')
      .where("TO_CHAR(leave.startDate,'YYYY-MM') = :month", { month })
      .andWhere("leave.status != 'rejected'")
      .getRawOne();

    const leaveDaysThisMonth = parseFloat(leavesThisMonth?.total || '0');

    const permResult = await this.permRepo
      .createQueryBuilder('perm')
      .select('SUM(perm.hours)', 'total')
      .where("TO_CHAR(perm.date,'YYYY-MM') = :month", { month })
      .getRawOne();

    const permHoursThisMonth = parseFloat(permResult?.total || '0');

    return { totalStaff, leavesThisMonth: leaveDaysThisMonth, permHoursThisMonth };
  }
}
